<script lang="ts">
	
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com"> 
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true"> 
	<link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet">
	
	<style>
		body {
			background-color: #fef6c4;
			font-family: 'Lato', sans-serif;
			color: #111;
		}
	</style>
</svelte:head>

<main>
	<slot />

	<div class="made-by">
		Made by <a
			href="https://n2d4.github.io"
			target="_blank"
			rel="noopener noreferrer">me</a
		>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		gap: 16px;
		padding: 16px;
	}

	.made-by {
		font-size: 75%;
		text-align: center;
	}
</style>
