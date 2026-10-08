# Workshop design system

A working handbook for teens: bold uppercase sans-serif headings, monospaced index labels, orange task-sheet rails, square controls, and compact challenge cards. No external fonts or imagery. The original icon family remains repository-owned.

Light mode uses warm paper (#f3f1e9), charcoal (#242622), and orange (#f16a2b). Dark mode uses deep charcoal (#171b18), lifted work surfaces, warm white text, and lighter orange for readable text. Theme tokens live in src/styles/global.css.

The header’s Light / Dark buttons expose pressed state and remember a preference in a separate localStorage key. First visit follows the device color scheme; subsequent visits apply the saved preference before paint. Storage failure does not prevent switching. Progress reset does not reset theme. Printing always uses light paper regardless of screen theme.

Visible keyboard focus, native controls, responsive navigation, readable text, and decorative SVGs accompany semantic structure. Challenge requirements and sample curriculum remain unchanged by this redesign.
