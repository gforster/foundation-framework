import { defineConfig } from 'astro/config';
export default defineConfig({site: process.env.SITE_URL || 'https://gforster.github.io', base: process.env.BASE_PATH || '/foundation-framework', trailingSlash:'always'});
