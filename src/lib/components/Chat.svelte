<script>
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { preventDefault } from 'svelte/legacy';
	import * as m from '$lib/paraglide/messages.js';

	import ChatMessage from './ChatMessage.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { pb } from '$lib/utils/api';

	let newMessage = $state('');
	/**
	 * @type {any[]}
	 */
	let messages = $state([]);
	/**
	 * @type {() => void}
	 */
	let unsubscribe;
	/**
	 * @type {HTMLDivElement}
	 */
	let scrollBottom = $state();
	/**
	 * @type {number}
	 */
	let lastScrollTop;
	let canAutoScroll = $state(true);
	let unreadMessages = $state(false);

	function autoScroll() {
		setTimeout(() => scrollBottom?.scrollIntoView({ behavior: 'smooth' }), 50);
		unreadMessages = false;
	}

	/**
	 * @param {any} e
	 */
	function watchScroll(e) {
		canAutoScroll = (e.target.scrollTop || Infinity) > lastScrollTop;
		lastScrollTop = e.target.scrollTop;
		unreadMessages = !canAutoScroll;
	}

	async function getInitialMessages() {
		try {
			const resultList = await pb.collection('chat_valiantlynx').getList(1, 50, {
				sort: 'created',
				expand: 'sender'
			});

			return resultList.items;
		} catch (error) {
			console.error('Fetching initial messages error:', error);
			return [];
		}
	}

	/**
	 * @param {{ action: string; record: any; }} param0
	 */
	async function handleRealtimeMessage({ action, record }) {
		try {
			if (action === 'create') {
				const sender = await pb.collection('users_valiantlynx').getOne(record.sender);

				record.expand = { sender };
				messages = [...messages, record];

				if (page.data.user.id !== record.receiver) {
					unreadMessages = true;
				}
			}
			if (action === 'delete') {
				messages = messages.filter((m) => m.id !== record.id);
			}
		} catch (error) {
			console.error('Realtime message subscription error:', error);
		}
	}

	onMount(async () => {
		messages = await getInitialMessages();
		unsubscribe = await pb.collection('chat_valiantlynx').subscribe('*', handleRealtimeMessage);
	});

	onDestroy(() => {
		unsubscribe?.();
	});

	async function sendMessage() {
		const data = {
			message: newMessage,
			sender: page.data.user?.id,
			receiver: page.data.user?.id
		};
		await pb.collection('chat_valiantlynx').create(data);
		newMessage = '';
		canAutoScroll = true;
		autoScroll();
	}
</script>

<div class=" p-4 space-y-4 items-center">
	<div class=" p-4 space-y-4 border-dashed border-2 border-primary sm:mx-20">
		<h2 class="text-2xl font-bold mb-4">{m['messages.join_discussion']?.()}</h2>

		<main class="overflow-y-auto" onscroll={watchScroll}>
			{#each messages as message (message.id)}
				<ChatMessage
					{message}
					sender={page.data.user?.username
						? page.data.user?.username
						: m['messages.not_logged_in']()}
				/>
			{/each}
			<div class="dummy" bind:this={scrollBottom}></div>
		</main>

		{#if !canAutoScroll}
			<div class="text-center justify-center flex">
				<Button variant="secondary" onclick={autoScroll}>
					{#if unreadMessages}
						💬
					{/if}
					🡣
				</Button>
			</div>
		{/if}

		<div class="border-t border-primary pt-4">
			<form onsubmit={preventDefault(sendMessage)} class="space-x-2 flex items-center">
				<Input
					type="text"
					placeholder={page.data.user
						? m['placeholders.write_comment']()
						: m['placeholders.login_to_comment']()}
					minlength="1"
					bind:value={newMessage}
					class="flex-grow"
				/>
				{#if page.data.user}
					<Button type="submit" variant="primary">{m['buttons.send']()}</Button>
				{:else}
					<Button href="/login" variant="primary">{m['navigation.login']()}</Button>
				{/if}
			</form>
		</div>
	</div>
</div>
