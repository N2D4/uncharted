/// <reference types="@sveltejs/kit" />

// TODO: find out why the imports throw errors in .svelte files without these declarations (even if @types/... is
// installed)
declare module 'prettier/standalone.js';
declare module 'prettier/parser-typescript.js';
declare module 'uuid';
declare module 'chart.js/auto/auto.js';
