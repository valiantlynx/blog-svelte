<script>
	import Social from '$lib/components/press/Social.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages.js';
	import { postPocketbase } from '$lib/utils/api';

	const contactData = $state({
		name: '',
		email: '',
		message: '',
		handled: false
	});

	function send() {
		// Send the data to the server
		postPocketbase('contact_valiantlynx', contactData);

		// Clear the form fields
		contactData.name = '';
		contactData.email = '';
		contactData.message = '';
	}
</script>

<svelte:head>
	<title>{m['pages.contact_title']()}</title>
	<meta name="description" content={m['pages.contact_description']()} />
</svelte:head>

<div class="container my-24 mx-auto md:px-6">
	<section class="mb-32 text-center">
		<div class="py-12 md:px-12">
			<div class="container mx-auto xl:px-32">
				<div class="grid items-center lg:grid-cols-2">
					<div class="mb-12 md:mt-12 lg:mt-0 lg:mb-0">
						<div class="relative z-[1] block rounded-lg glass px-6 py-12 md:px-12 lg:-mr-14">
							<h2
								class="mb-4 p-4 text-3xl font-bold bg-base-300 rounded-t-lg border-x-8 border-t-8 border-b-2 border-primary"
							>
								{m['forms.contact_heading']()}
							</h2>
							<form
								class="bg-base-300 rounded-b-lg border-x-8 border-b-8 border-t-2 border-primary"
							>
								<div class="relative mb-6" data-te-input-wrapper-init>
									<input
										type="text"
										class="peer block w-full rounded-none border-0 bg-transparent py-2 px-3 outline-none"
										id="exampleInput90"
										bind:value={contactData.name}
										placeholder={m['forms.contact_name_placeholder']()}
									/>
									<label
										class="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
										for="exampleInput90"
										>{contactData.name ? contactData.name : m['forms.contact_name_placeholder']()}
									</label>
								</div>
								<div class="relative mb-6" data-te-input-wrapper-init>
									<input
										type="email"
										class="peer block w-full rounded-none border-0 bg-transparent py-2 px-3 outline-none"
										id="exampleInput91"
										bind:value={contactData.email}
										placeholder={m['forms.contact_email_placeholder']()}
									/>
									<label
										class="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
										for="exampleInput91"
										>{contactData.email
											? contactData.email
											: m['forms.contact_email_placeholder']()}
									</label>
								</div>
								<div class="relative mb-6" data-te-input-wrapper-init>
									<textarea
										class="peer block w-full rounded-none border-0 bg-transparent py-2 px-3 outline-none"
										id="exampleFormControlTextarea1"
										rows="3"
										bind:value={contactData.message}
										placeholder={m['forms.contact_message_placeholder']()}
									></textarea>
									<label
										for="exampleFormControlTextarea1"
										class="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
										>{contactData.message
											? contactData.message
											: m['forms.contact_message_placeholder']()}</label
									>
								</div>
								<div class="mb-6 inline-block min-h-[1.5rem] justify-center pl-[1.5rem] md:flex">
									<input type="checkbox" id="exampleCheck96" checked />
									<label
										class="inline-block pl-[0.15rem] hover:cursor-pointer"
										for="exampleCheck96"
									>
										{m['forms.contact_copy_checkbox']()}
									</label>
								</div>
								<Button
									type="button"
									variant="primary"
									size="lg"
									class="mb-4 w-3/4 font-bold text-xl shadow-black shadow-inner"
									onclick={send}
								>
									{m['forms.contact_button']()}
								</Button>
							</form>
						</div>
					</div>
					<div class="md:mb-12 lg:mb-0">
						<div class="relative h-[700px] rounded-lg shadow-lg">
							<iframe
								title="map"
								src="https://maps.google.com/maps?q=oslo&t=&z=13&ie=UTF8&iwloc=&output=embed"
								class="absolute left-0 top-0 h-full w-full rounded-lg"
								frameborder="0"
								allowfullscreen
							></iframe>
						</div>
					</div>
				</div>
			</div>
		</div>

		<h2 class="mb-12 text-3xl font-bold">{m['contact.also_contact']()}</h2>
		<Social />
	</section>
</div>
