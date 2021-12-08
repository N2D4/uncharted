<script lang="ts">
	import { getHumanReadableName, prettyToString } from '../../utils/utils';
	import type { Result } from '../../utils/results';
	import type { Parameter, ParameterValue } from '../../utils/parameters';
	import type { EvalFunction } from '../../utils/ts-compiler';

	export let results: Result[];
	export let parameters: Map<Parameter, ParameterValue>;
	export let func: EvalFunction;

	let header: readonly [Parameter[], Result[]];
	let rows: readonly [string[], string[]][];
	$: {
        // Headers
		const computeParameters = [...parameters].flatMap(([param, value]) =>
			value[0] !== 'number-range' ? [] : ([[param, value]] as const)
		);
		header = [computeParameters.map((x) => x[0]), results];

        // Rows
		const valuesPerParam =
			computeParameters.length === 0
				? 1
				: Math.min(10, Math.max(2, Math.floor(20 ** (1 / computeParameters.length))));
		const totalRows = valuesPerParam ** computeParameters.length;
		rows = new Array(totalRows).fill(0).map(() => [[], []]);
		for (let i = 0; i < totalRows; i++) {
			let j = i;
            const assignedParameters = new Map<Parameter, number>();
			for (const [parameter, value] of computeParameters) {
				const [_, min, max] = value;
				const step = (max - min) / (valuesPerParam - 1);
                const assignedValue = min + (j % valuesPerParam) * step;
                assignedParameters.set(parameter, assignedValue);
				rows[i][0].push(prettyToString(assignedValue));
				j = Math.floor(j / valuesPerParam);
			}


            const args = [...parameters].map(([parameter, value]) => {
                switch (value[0]) {
                    case 'number-range':
                        return assignedParameters.get(parameter)!;
                    case 'literal':
                        return value[1];
                    default:
                        throw new Error(`Unknown parameter type ${value[0]}`);
                }
            });
            try {
                const value = func(...args);

                for (const result of results) {
                    rows[i][1].push(prettyToString(value?.[result.name]));
                }  
            } catch (e) {
                console.error(`Error evaluating table`, {parameters, error: e, func});
                rows[i][1].push(e instanceof Error ? e.name : `error: ${e}`);
            }        
		}
	}
</script>

<div class="container">
	<table>
		<tr>
			{#each header[0] as parameter, i}
				<th class:lastParameter={i === header[0].length - 1}>
					{getHumanReadableName(parameter.name)}
				</th>
			{/each}
			{#each header[1] as result, i}
				<th class:firstResult={i === 0}>{getHumanReadableName(result.name)}</th>
			{/each}
		</tr>
        {#each rows as row}
            <tr>
                {#each row[0] as value, i}
                    <td class:lastParameter={i === row[0].length - 1}>{value}</td>
                {/each}
                {#each row[1] as value, i}
                    <td class:firstResult={i === 0}>{value}</td>
                {/each}
            </tr>
        {/each}
	</table>
</div>

<style>
	.container {
		overflow: auto;
	}

	table {
		border-collapse: collapse;
	}

	th {
		padding: 8px;
		white-space: nowrap;
	}

	td {
		padding: 4px;
		text-align: center;
	}

	.lastParameter {
		border-right: 1px solid black;
		padding-right: 16px;
	}

	.firstResult {
		padding-left: 16px;
	}
</style>
