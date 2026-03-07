<script>
	import { Input as UIInput } from '$lib/components/ui/input';
	import { FormControl } from '$lib/components/ui/form-control';

	let {
		value = '',
		placeholder = '',
		id,
		label,
		type = 'text',
		disabled = false,
		required = false,
		minlength,
		errors
	} = $props();
</script>

<FormControl {label} {required} error={errors?.[0]} class="w-full max-w-lg mb-2">
	<UIInput
		{type}
		{placeholder}
		{id}
		name={id}
		bind:value
		{disabled}
		{required}
		{minlength}
		error={!!errors}
	/>
</FormControl>
