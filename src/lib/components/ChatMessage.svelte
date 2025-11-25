<script>
	import { site } from '@valiantlynx/general-config';
	
	/**
	 * @typedef {Object} Props
	 * @property {{ expand: { sender: { username: any; avatar: any; id: any; }; }; created: string | number | Date; message: any; }} message
	 * @property {any} sender
	 */

	/** @type {Props} */
	let { message, sender } = $props();

	//console.log('message: ', message, 'sender: ', message.expand?.sender.username);

	const messageClass = message.expand?.sender.username === sender ? 'chat-end' : 'chat-start';
	const avatar = message.expand?.sender?.avatar
		? `${site.site.pocketbase}/api/files/${message.expand?.sender?.collectionId}/${message.expand?.sender?.id}/${message.expand?.sender?.avatar}`
		: message.expand?.sender.username
			? `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${message.expand?.sender?.username}`
			: 'https://animevariant.fly.dev/api/files/_pb_users_auth_/cl1wlk9epnlmdsg/pngtree_anonymous_in_a_hood_red_concept_vector_png_image_6109862_8C3s64ADd8.jpg?token=';

	const ts = new Date(message.created);
</script>

<div class={`chat ${messageClass}`}>
	<div class="chat-image avatar">
		<div class="w-10 rounded-full">
			<img src={avatar} alt="avatar" />
		</div>
	</div>
	<div class="chat-header">
		{#if sender !== 'the user isnt logged in' || message.expand?.sender.username}
			{message.expand?.sender.username}
		{:else}
			Anonymous
		{/if}
		<time class="text-xs opacity-50">{ts.toLocaleTimeString()}</time>
	</div>
	<div class="chat-bubble">{@html message.message}</div>
	{#if messageClass === 'chat-end'}
		<div class="chat-footer opacity-50">comment sent</div>
	{:else}
		<div class="chat-footer opacity-50">comment delivered</div>
	{/if}
</div>
