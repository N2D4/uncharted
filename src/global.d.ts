/// <reference types="@sveltejs/kit" />

// TODO: find out why the imports throw errors in .svelte files without these declarations (even if @types/... is
// installed)
declare module 'prettier/standalone';
declare module 'prettier/parser-typescript';
declare module 'uuid';
