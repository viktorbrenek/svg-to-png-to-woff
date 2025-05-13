# What is "Iconimo"? .SVG to .PNG to .PGM to .SVG to Font Toolchain

This tool automatically converts SVG icons exported from Figma (including cutouts and complex shapes) into a clean web icon font.

Why? I’ve tried (what feels like) every existing solution for converting SVGs directly into fonts—but each of them failed when handling more complex SVGs that included advanced operations like exclude, difference, union, and others. These operations often cause rendering issues, and the only tool that sometimes handled them correctly was IcoMoon.

Since I wanted a fully reliable, custom solution, I discovered that SVGs can be converted to PNG almost losslessly—and then traced back into vector format using bitmap tracers that completely ignore Figma-specific features that tend to break font conversion. After countless rounds of trial and error, this tool was born.

## 💡 Use Case: Why Convert SVG Icons to a Font?

Converting SVG icons into a font provides a highly efficient and scalable way to manage icons across websites and applications. Fonts are vector-based, lightweight, and render crisply on any screen resolution—making them ideal for responsive design. 

Unlike inline SVGs or icon sprites, font-based icons can be styled easily with CSS:

```css
.icon-home {
  font-family: "my-icons";
  font-size: 24px;
  color: #333;
}
```

This approach reduces the need for additional markup or external assets, simplifying the integration of icon sets in both small and large projects.

---

### ✅ What You Can Use It For

- Web projects via CSS classes (e.g., `.icon-home`)
- Design systems with unified token-based theming
- Component libraries (React, Vue, etc.) that need scalable icon sets
- Low-bandwidth environments where every kilobyte matters

---

This tool enables you to export clean, reliable web icon fonts from complex Figma SVGs—handling tricky shapes, cutouts, and boolean operations that most direct converters fail to process.

Whether you're building a robust design system or just want pixel-perfect, scalable icons without SVG quirks, this tool gives you total control over your icon pipeline.


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

A) All source icons must have the same size. For example 24x24 (tested). If there is a different size in one of your icons, it can create unwanted elements in such icon.

B) Note: Fantasticon does not handle sorting of special European characters (e.g. š, č, ch, ž) correctly. As a result, icons with such names might be ordered unexpectedly. To avoid potential issues, it's recommended to stick to basic Latin characters when naming your icons.

## 📝 Notes

- This tool handles `fill-rule="evenodd"` properly, which can cause issues with typical vector conversion.
- If your SVG uses `clipPath`, `mask`, or `use`, the bitmap tracing ensures the output looks correct.

---

## 📄 Icons License and Attribution

Icons are sourced from [Solar Icons](https://github.com/AlfieJones/solar), licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

By using these icons, we comply with the license terms by providing proper attribution:

> Solar Icons by [Alfie Jones](https://github.com/AlfieJones/solar) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## 📄 Third-party Licenses and Attribution

#### 🧠 Node packages:

- **[sharp](https://github.com/lovell/sharp)**  
  License: [Apache License 2.0](https://github.com/lovell/sharp/blob/main/LICENSE)  
  Used to convert SVGs to PNGs for tracing.

#### ⚙️ System CLI tools (must be installed manually):

- **[ImageMagick](https://imagemagick.org/)** (specifically `convert` or `magick` CLI)  
  License: [Apache License 2.0](https://imagemagick.org/script/license.php)  
  Used to convert PNG images to grayscale PGM format before tracing.

- **[Potrace](http://potrace.sourceforge.net/)**  
  License: [GNU General Public License v2.0](https://opensource.org/licenses/GPL-2.0)  
  Used for bitmap to SVG vector tracing.

- **[Fantasticon](https://github.com/tancredi/fantasticon)**  
  License: [MIT License](https://github.com/tancredi/fantasticon/blob/master/LICENSE)  
  Used to generate icon fonts from processed SVG files.

---

## UPDATES

➡️ **Console output for all scripts**: Reports how many SVGs were successfully processed with each processor.

#### 1. Flatten SVGs to organize them normally

The default sorting of icons was from Z to A. With this simple script i reversed it. 

```bash
npm run flatten
```

#### 2. Generate LESS and TypeScript token files

These scripts output icon names and codepoints for web usage. Same as IcoMoon:

```bash
npm run generate:less
npm run generate:ts
```

You can use the generated LESS for icon mixins and the TypeScript file for auto-completion or type-safe icon references in web apps.
