<script>
	import Oauth2SingleServer from './Oauth2SingleServer.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class="flex flex-col w-full">
		<!-- auth with google -->
	<div class="w-full block my-10">
		<Oauth2SingleServer
			logo="https://avatars.githubusercontent.com/u/177398145?s=200&v=4"
			provider="samletnorge"
		/>
	</div>
	<div class="flex flex-row justify-between w-full">
		<a href="/signup" class="text-sm text-[var(--primary)] hover:underline"
			>{m['labels.not_registered']()} {m['buttons.register']()}</a
		>
	</div>
</div>
