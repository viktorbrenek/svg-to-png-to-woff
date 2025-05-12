# SVG to Font Toolchain

Tento nástroj slouží k automatické konverzi SVG ikon exportovaných z Figmy (včetně výřezů a složitých tvarů) na čistý webový ikonový font.

## 🔧 Složky

- `iconyzfigmy/` – sem nahrajte původní SVG ikony exportované z Figmy
- `tmp/` – dočasné soubory (PNG, PGM)
- `output/` – hotové SVG po bitmapovém trasování
- `dist/` – výsledný ikonový font

---

## 🧰 Požadavky

- Node.js (doporučeno 18+)
- `npx` a `fantasticon`
- [ImageMagick](https://imagemagick.org/) (příkaz `convert`)
- [Potrace](http://potrace.sourceforge.net/) (trasování bitmap na vektor)

Na macOS lze nainstalovat pomocí:

```bash
brew install imagemagick potrace
npm install
```

---

## 🚀 Postup

### 1. Nahraj SVG ikony z Figmy

Zkopíruj své SVG soubory do složky:

```
iconyzfigmy/
```

Každý soubor by měl obsahovat jeden tvar (ideálně černý na průhledném pozadí).

---

### 2. Spusť trasování SVG na čisté cesty

Tento skript provede:

- SVG → PNG
- PNG → PGM (černobílý obraz)
- PGM → SVG pomocí `potrace`

```bash
node trace-svg.js
```

Hotové soubory se uloží do složky `output/`.

---

### 3. Vygeneruj ikonový font

Použij `fantasticon` pro převod SVG na WOFF/TTF fonty:

```bash
npx fantasticon --config .fantasticonrc.cjs
```

Tento krok:

- vezme SVG ze složky `output/`
- vygeneruje ikonový font do `dist/`
- vytvoří i `style.css` s mapou ikon

---

## ✅ Výsledek

Fonty najdeš ve složce `dist/`. Můžeš je ihned použít na webu nebo v aplikaci.

---

## 📝 Poznámky

- Tento nástroj řeší i výřezy (`fill-rule="evenodd"`), které bývají problém při běžném převodu.
- Pokud SVG obsahuje `clipPath`, `mask` nebo `use`, bitmapové trasování zajistí správný výsledek.
