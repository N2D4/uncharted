<script lang="ts">
    import type { Parameter, ParameterValue } from "src/utils/parameters";
    import { createEventDispatcher } from "svelte";

    export let parameter: Parameter;
    export let initialValue: ParameterValue;

    const dispatch = createEventDispatcher();
</script>

<div>Number parameter {JSON.stringify([parameter, initialValue])}</div>
