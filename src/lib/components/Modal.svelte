<script lang="ts">
	let {
		label,
		checked,
		trigger,
		heading,
		children,
		actions
	} = $props();
</script>

<label for={label}>
	{@render trigger?.()}
</label>

<input type="checkbox" id={label} class="modal-toggle" {checked} />
<label for={label} class="modal modal-bottom sm:modal-middle">
	<label for="" class="modal-box">
		<div class="font-bold text-xl text-center">
			{@render heading?.()}
		</div>
		<div class="my-2">
			{@render children?.()}
		</div>
		<div class="modal-action justify-center">
			{@render actions?.()}
		</div>
	</label>
</label>
