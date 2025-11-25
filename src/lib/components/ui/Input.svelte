<script lang="ts">
	interface Props {
		type?: string;
		id: string;
		label?: string;
		value?: string;
		errors?: string[];
		disabled?: boolean;
		required?: boolean;
		minlength?: number;
		placeholder?: string;
		name?: string;
	}

	let {
		type = 'text',
		id,
		label = '',
		value = '',
		errors = [],
		disabled = false,
		required = false,
		minlength,
		placeholder = '',
		name
	}: Props = $props();

	const inputName = name ?? id;
</script>

<div class="form-control w-full max-w-lg">
	{#if label}
		<label for={id} class="label">
			<span class="label-text">{label}</span>
		</label>
	{/if}
	<input
		{type}
		{id}
		name={inputName}
		{value}
		{disabled}
		{required}
		{minlength}
		{placeholder}
		class="input input-bordered w-full max-w-lg"
		class:input-error={errors && errors.length > 0}
	/>
	{#if errors && errors.length > 0}
		{#each errors as error}
			<label for={id} class="label">
				<span class="label-text-alt text-error">{error}</span>
			</label>
		{/each}
	{/if}
</div>
