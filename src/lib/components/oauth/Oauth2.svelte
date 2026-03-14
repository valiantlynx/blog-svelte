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
		<a href="/forgot-password" class="text-sm text-[var(--primary)] hover:underline"
			>{m['labels.forgot_password']()}</a
		>
	</div>

	<h6 class="text-center font-bold mt-4">Other Providers</h6>
	<!-- auth with google -->
	<div class="w-full block my-4">
		<Oauth2SingleServer
			logo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/960px-Google_Favicon_2025.svg.png"
			provider="google"
		/>
	</div>
	<h6 class="text-center">{m['messages.coming_soon']?.()}</h6>

	<!-- auth with apple -->
	<div class="w-full block my-4">
		<Oauth2SingleServer
			logo="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/960px-Apple_logo_black.svg.png?_=20250629104141"
			provider="apple"
			active={false}
		/>
	</div>

	<!-- auth with facebook -->
	<div class="w-full block my-4">
		<Oauth2SingleServer
			logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/960px-2023_Facebook_icon.svg.png"
			provider="facebook"
			active={false}
		/>
	</div>

	<!-- auth with microsoft -->
	<div class="w-full block my-4">
		<Oauth2SingleServer
			logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png?_=20210729021049"
			provider="microsoft"
			active={false}
		/>
	</div>

	<!-- auth with instagram -->
	<div class="w-full block my-4">
		<Oauth2SingleServer
			logo="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/330px-Instagram_logo_2016.svg.png?_=20210403190622"
			provider="instagram"
			active={false}
		/>
	</div>

	<!-- auth with X (twitter) -->
	<div class="w-full block my-4">
		<Oauth2SingleServer
			logo="https://cdn.cms-twdigitalassets.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.2560.png"
			provider="twitter"
			active={false}
		/>
	</div>
</div>
