# What is "Iconimo"? .SVG to .PNG to .PGM to .SVG to Font Toolchain

This tool automatically converts SVG icons exported from Figma (including cutouts and complex shapes) into a clean web icon font.

Why? I’ve tried (what feels like) every existing solution for converting SVGs directly into fonts—but each of them failed when handling more complex SVGs that included advanced operations like exclude, difference, union, and others. These operations often cause rendering issues, and the only tool that sometimes handled them correctly was IcoMoon.

Since I wanted a fully reliable, custom solution, I discovered that SVGs can be converted to PNG almost losslessly—and then traced back into vector format using bitmap tracers that completely ignore Figma-specific features that tend to break font conversion. After countless rounds of trial and error, this tool was born.

## 🔧 Folder Structure

- `iconyzfigmy/` – place your original SVG icons exported from Figma here
- `tmp/` – temporary files (PNG, PGM)
- `output/` – cleaned SVGs after bitmap tracing
- `dist/` – final generated icon font

---

## 🧰 Requirements

- Node.js (recommended 18+)
- `npx` and `fantasticon`
- [ImageMagick](https://imagemagick.org/) (`convert` command)
- [Potrace](http://potrace.sourceforge.net/) (bitmap to vector tracer)

On macOS, you can install them with:

```bash
brew install imagemagick potrace
npm install
```

---

## 🚀 Workflow

### 1. Add your SVG icons from Figma

Copy your SVG files into:

```
iconyzfigmy/
```

Each file should contain a single shape, preferably black on a transparent background.

---

### 2. Trace SVGs into clean vector paths

This script performs the following steps:

- SVG → PNG
- PNG → PGM (grayscale image)
- PGM → SVG using `potrace`

```bash
node trace-svg.js
```

The traced SVG files will be saved in the `output/` folder.

---

### 3. Generate the icon font

Use `fantasticon` to convert SVGs into WOFF/TTF font formats:

```bash
npx fantasticon --config .fantasticonrc.cjs
```

This step:

- takes SVGs from the `output/` folder
- generates the icon font into `dist/`
- creates a `style.css` file with icon mapping

---

## ✅ Output

You will find the generated fonts in the `dist/` folder, ready to use in your web or app project.

---

## 📝 Current problems

For now the generated icon-types.ts is generated backwards from Z to A. However it is an easy fix with VS Code command "sort ascending" if you really need it to be from A to Z. 

## 📝 Notes

- This tool handles `fill-rule="evenodd"` properly, which can cause issues with typical vector conversion.
- If your SVG uses `clipPath`, `mask`, or `use`, the bitmap tracing ensures the output looks correct.

---

## 📄 License and Attribution

Icons are sourced from [Solar Icons](https://github.com/AlfieJones/solar), licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

By using these icons, we comply with the license terms by providing proper attribution:

> Solar Icons by [Alfie Jones](https://github.com/AlfieJones/solar) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
