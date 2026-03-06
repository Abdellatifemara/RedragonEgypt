#!/bin/bash
# Redragon Egypt — Full Product Data Loop
# Runs until ALL products have CDN images, software, manual
# Creates SKIPPED.md for items with no data found
# Pushes to GitHub every 5 products
# DO NOT STOP UNTIL DONE

DEPLOY="C:/Users/pc/Desktop/G/Redragon/clean_deploy"
JSON="$DEPLOY/data/products.json"
LOG="$DEPLOY/loop.log"
SKIPPED="$DEPLOY/SKIPPED.md"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
PUSH_EVERY=5
push_counter=0

log() { echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG"; }
fetch() { sleep 6 && curl -s -L -k -A "$UA" "$1" -o "$2"; wc -c < "$2"; }

# JSON helper: update a product field
update_json() {
  local model="$1" field="$2" value="$3"
  node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('$JSON','utf8'));
const p=d.find(x=>x.model==='$model'||x.id==='$model');
if(p){ p['$field']=$value; fs.writeFileSync('$JSON',JSON.stringify(d,null,2)); process.stdout.write('OK'); }
else process.stdout.write('NOT_FOUND');
" 2>/dev/null
}

update_images() {
  local model="$1" img1="$2" img2="$3" img3="$4"
  node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('$JSON','utf8'));
const p=d.find(x=>x.model==='$model'||x.id==='$model');
if(p){
  const imgs=['$img1'];
  if('$img2'&&'$img2'!='') imgs.push('$img2');
  if('$img3'&&'$img3'!='') imgs.push('$img3');
  p.images=imgs;
  fs.writeFileSync('$JSON',JSON.stringify(d,null,2));
  process.stdout.write('OK');
} else process.stdout.write('NOT_FOUND');
" 2>/dev/null
}

push_progress() {
  push_counter=$((push_counter+1))
  if [ $((push_counter % PUSH_EVERY)) -eq 0 ]; then
    log ">>> PUSHING TO GITHUB <<<"
    cd "$DEPLOY" && git add data/products.json && \
      git commit -m "auto-update: CDN images, software, manuals batch $push_counter" && \
      git push origin fresh_deploy:main --force && \
      log "PUSHED OK" || log "PUSH FAILED"
  fi
}

add_skipped() {
  local model="$1" reason="$2"
  echo "- $model: $reason" >> "$SKIPPED"
  log "SKIPPED $model: $reason"
}

# Find product page slug
find_product_slug() {
  local q="$1"
  fetch "https://redragonshop.com/search?type=product&q=$q" /tmp/slug_search.html > /dev/null
  grep -oP '(?<=href="/products/)[^"?]+' /tmp/slug_search.html | head -3
}

# Find download page slug
find_dl_slug() {
  local q="$1"
  fetch "https://redragonshop.com/search?type=article&q=$q" /tmp/dl_search.html > /dev/null
  grep -oP '(?<=href="/blogs/product-download/)[^"?]+' /tmp/dl_search.html | head -3
}

# Extract CDN images from a fetched product page
get_images() {
  grep -oiE 'https://cdn\.shopify\.com/[^"]+\.(jpg|png|webp)[^"]*' "$1" \
    | grep -iE 'product|mouse|keyboard|headset|gamepad|combo|gaming|redragon' \
    | grep -iv 'logo\|icon\|badge\|banner\|thumbnail_crop\|warrant\|cert' \
    | sort -u | head -4
}

# Get software+manual from download page
get_downloads() {
  grep -oiE 'https?://[^"<>]*\.(rar|zip|exe|pdf)[^"<> ]*' "$1" | sort -u
}

# ============================================================
# PROCESS ONE PRODUCT — given model name and search term
# ============================================================
process_product() {
  local model="$1"
  local search_term="${2:-$1}"
  local product_slug="${3:-}"  # optional known slug
  local dl_slug="${4:-}"       # optional known download slug

  log "=== Processing: $model ==="

  # --- IMAGES ---
  local needs_cdn
  needs_cdn=$(node -e "
const d=JSON.parse(require('fs').readFileSync('$JSON','utf8'));
const p=d.find(x=>x.model==='$model'||x.id==='$model');
if(!p){process.stdout.write('NOT_FOUND');process.exit();}
const ok=p.images&&p.images.length>0&&p.images.every(i=>i.startsWith('http'));
process.stdout.write(ok?'CDN_OK':'NEEDS_CDN');
" 2>/dev/null)

  if [ "$needs_cdn" = "NEEDS_CDN" ]; then
    log "  Fetching product page for CDN images..."
    # Find slug if not provided
    if [ -z "$product_slug" ]; then
      local slugs
      slugs=$(find_product_slug "$search_term")
      product_slug=$(echo "$slugs" | head -1)
    fi

    if [ -n "$product_slug" ]; then
      local sz
      sz=$(fetch "https://redragonshop.com/products/$product_slug" /tmp/prod_page.html)
      if [ "$sz" -gt 100000 ]; then
        local imgs
        imgs=$(get_images /tmp/prod_page.html)
        local img1 img2 img3
        img1=$(echo "$imgs" | sed -n '1p')
        img2=$(echo "$imgs" | sed -n '2p')
        img3=$(echo "$imgs" | sed -n '3p')
        if [ -n "$img1" ]; then
          update_images "$model" "$img1" "$img2" "$img3"
          log "  Images updated: $img1"
        else
          add_skipped "$model" "No CDN images found on product page $product_slug"
        fi
      else
        log "  Cloudflare blocked for product page, skipping images"
        add_skipped "$model" "CF blocked on product page"
      fi
    else
      add_skipped "$model" "No product page slug found"
    fi
  else
    log "  Images: already CDN OK"
  fi

  # --- SOFTWARE ---
  local has_sw
  has_sw=$(node -e "
const d=JSON.parse(require('fs').readFileSync('$JSON','utf8'));
const p=d.find(x=>x.model==='$model'||x.id==='$model');
if(!p){process.stdout.write('NOT_FOUND');process.exit();}
process.stdout.write(p.softwareUrl?'HAS_SW':'NEEDS_SW');
" 2>/dev/null)

  local has_man
  has_man=$(node -e "
const d=JSON.parse(require('fs').readFileSync('$JSON','utf8'));
const p=d.find(x=>x.model==='$model'||x.id==='$model');
if(!p){process.stdout.write('NOT_FOUND');process.exit();}
process.stdout.write(p.manualUrl?'HAS_MAN':'NEEDS_MAN');
" 2>/dev/null)

  if [ "$has_sw" = "NEEDS_SW" ] || [ "$has_man" = "NEEDS_MAN" ]; then
    log "  Fetching download page..."
    local dl_slugs
    if [ -z "$dl_slug" ]; then
      dl_slugs=$(find_dl_slug "$search_term")
      dl_slug=$(echo "$dl_slugs" | head -1)
    fi

    if [ -n "$dl_slug" ]; then
      local sz2
      sz2=$(fetch "https://redragonshop.com/blogs/product-download/$dl_slug" /tmp/dl_page.html)
      if [ "$sz2" -gt 100000 ]; then
        local downloads
        downloads=$(get_downloads /tmp/dl_page.html)
        local sw_url man_url
        sw_url=$(echo "$downloads" | grep -iE '\.(exe|rar|zip)' | head -1)
        man_url=$(echo "$downloads" | grep -iE '\.pdf' | head -1)
        if [ -n "$sw_url" ] && [ "$has_sw" = "NEEDS_SW" ]; then
          update_json "$model" "softwareUrl" "\"$sw_url\""
          log "  softwareUrl: $sw_url"
        fi
        if [ -n "$man_url" ] && [ "$has_man" = "NEEDS_MAN" ]; then
          update_json "$model" "manualUrl" "\"$man_url\""
          log "  manualUrl: $man_url"
        fi
        if [ -z "$sw_url" ] && [ -z "$man_url" ]; then
          add_skipped "$model" "Download page $dl_slug had no .exe/.rar/.zip/.pdf files"
        fi
      else
        add_skipped "$model" "CF blocked on download page $dl_slug"
      fi
    else
      add_skipped "$model" "No download page found for $search_term"
    fi
  else
    log "  SW+Manual: already OK"
  fi

  push_progress
}

# ============================================================
# ADD NEW PRODUCT (from PDF, not yet in JSON)
# ============================================================
add_new_product() {
  local model="$1" name="$2" category="$3" product_slug="$4"

  # Check if already in JSON
  local exists
  exists=$(node -e "
const d=JSON.parse(require('fs').readFileSync('$JSON','utf8'));
const p=d.find(x=>x.model==='$model'||x.id==='$model');
process.stdout.write(p?'EXISTS':'NEW');
" 2>/dev/null)

  if [ "$exists" = "EXISTS" ]; then
    log "  $model already in JSON, running update instead"
    process_product "$model" "$model" "$product_slug"
    return
  fi

  log "=== ADDING NEW: $model ($name) ==="

  # Find slug if not provided
  if [ -z "$product_slug" ]; then
    local slugs
    slugs=$(find_product_slug "$model")
    product_slug=$(echo "$slugs" | head -1)
  fi

  if [ -z "$product_slug" ]; then
    add_skipped "$model" "NEW PRODUCT — no product page slug found"
    return
  fi

  local sz
  sz=$(fetch "https://redragonshop.com/products/$product_slug" /tmp/new_prod.html)
  if [ "$sz" -lt 100000 ]; then
    add_skipped "$model" "NEW PRODUCT — CF blocked or 404 on $product_slug"
    return
  fi

  # Extract images
  local imgs img1 img2 img3
  imgs=$(get_images /tmp/new_prod.html)
  img1=$(echo "$imgs" | sed -n '1p')
  img2=$(echo "$imgs" | sed -n '2p')
  img3=$(echo "$imgs" | sed -n '3p')

  if [ -z "$img1" ]; then
    add_skipped "$model" "NEW PRODUCT — No CDN images found"
    return
  fi

  # Extract specs from fenkai divs
  local specs_raw
  specs_raw=$(grep -oP '(?<=<div class="fenkai"><span>)[^<]+(?=</span><span>)|(?<=</span><span>)[^<]+(?=</span></div>)' /tmp/new_prod.html | paste - - | head -20)

  # Find download page
  local dl_slug dl_slugs sw_url man_url
  dl_slugs=$(find_dl_slug "$model")
  dl_slug=$(echo "$dl_slugs" | head -1)
  if [ -n "$dl_slug" ]; then
    local sz2
    sz2=$(fetch "https://redragonshop.com/blogs/product-download/$dl_slug" /tmp/new_dl.html)
    if [ "$sz2" -gt 100000 ]; then
      local downloads
      downloads=$(get_downloads /tmp/new_dl.html)
      sw_url=$(echo "$downloads" | grep -iE '\.(exe|rar|zip)' | head -1)
      man_url=$(echo "$downloads" | grep -iE '\.pdf' | head -1)
    fi
  fi

  # Build JSON entry via node
  node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('$JSON','utf8'));
const imgs=['$img1'];
if('$img2') imgs.push('$img2');
if('$img3') imgs.push('$img3');
const entry={
  id:'$model',
  model:'$model',
  name:'$name',
  category:'$category',
  images:imgs,
  features:[],
  specifications:{}
};
if('$sw_url') entry.softwareUrl='$sw_url';
if('$man_url') entry.manualUrl='$man_url';
d.push(entry);
fs.writeFileSync('$JSON',JSON.stringify(d,null,2));
console.log('ADDED $model');
" 2>/dev/null

  log "  Added new product $model with images, sw=$sw_url, man=$man_url"
  push_progress
}

# ============================================================
# INITIALIZE LOG AND SKIPPED FILE
# ============================================================
echo "# Redragon Products — SKIPPED (no data found)" > "$SKIPPED"
echo "# Generated $(date)" >> "$SKIPPED"
echo "" >> "$SKIPPED"
log "=============================="
log "STARTING FULL PRODUCT LOOP"
log "=============================="

# ============================================================
# === EXISTING MICE — CDN images + software + manual ===
# ============================================================
log "--- MICE ---"
process_product "M601-RGB" "centrophorus+M601+RGB" "centrophorus-m601-rgb"
process_product "M602-KS" "M602+gaming+mouse" "cobra-m602"
process_product "M607" "M607+gaming+mouse" ""
process_product "M607-white" "M607+white+mouse" ""
process_product "M609" "M609+gaming+mouse" ""
process_product "m617-lit" "M617+gaming+mouse" ""
process_product "m655-ks" "M655+gaming+mouse" ""
process_product "M690 PRO" "M690+PRO+mouse" "mirage-m690-pro"
process_product "M694" "M694+gaming+mouse" ""
process_product "m701-RGB" "M701+RGB+mouse" ""
process_product "M703" "M703+gaming+mouse" ""
process_product "m711" "cobra+M711+mouse" "cobra-m711"
process_product "M711C" "M711C+mouse" "cobra-m711"
process_product "m723" "M723+gaming+mouse" ""
process_product "m724" "M724+gaming+mouse" ""
process_product "m724-white" "M724+white+mouse" ""
process_product "m725 lit" "M725+gaming+mouse" ""
process_product "m808-ks" "M808+gaming+mouse" "storm-m808"
process_product "M814RGB-PRO" "M814+PRO+mouse" ""
process_product "m815-pro" "M815+PRO+mouse" "redragon-m815-pro-gaming-mice"
process_product "m816-lit" "M816+LIT+mouse" "redragon-m816-std-gaming-mice"
process_product "M908" "impact+M908+mouse" "impact-m908"
process_product "M693" "trident+M693+mouse" "trident-m693-wireless-bluetooth-mouse"
process_product "M806" "bullseye+M806+mouse" "bullseye-m806"

# ============================================================
# === EXISTING KEYBOARDS ===
# ============================================================
log "--- KEYBOARDS ---"
process_product "k502" "K502+keyboard" "pegasus-k502"
process_product "K503" "K503+keyboard" ""
process_product "K503 aw" "K503+white+keyboard" ""
process_product "K505" "K505+keyboard" ""
process_product "K509P-KS" "K509P+keyboard" ""
process_product "K509P-wS" "K509P+white+keyboard" ""
process_product "k551" "K551+keyboard" ""
process_product "K552 RGB red sw" "K552+RGB+red+keyboard" ""
process_product "K552 RGB browb sw" "K552+RGB+brown+keyboard" ""
process_product "k552-KB Blue Switch" "K552+blue+keyboard" ""
process_product "k552-KR Red Switch" "K552+KR+red+keyboard" ""
process_product "k552L-KR NO LIGHT Red Switch" "K552+no+light+keyboard" ""
process_product "K607-RGB" "K607+RGB+keyboard" ""
process_product "K615P-KBS" "K615P+keyboard" ""
process_product "K617-RGB White/Grey" "K617+RGB+keyboard" ""
process_product "k629-rgb" "K629+RGB+keyboard" ""
process_product "k685 PYG" "K685+keyboard" ""
process_product "K599-WBS" "K599+blue+keyboard" ""
process_product "K599-WRS" "K599+red+keyboard" ""
process_product "K661 WGY" "K661+keyboard" ""

# ============================================================
# === EXISTING HEADSETS ===
# ============================================================
log "--- HEADSETS ---"
process_product "H231-RGB" "H231+headset" "scream-h231"
process_product "H260" "H260+headset" ""
process_product "H270" "H270+headset" ""
process_product "h315" "H315+headset" "rebellion-h315"
process_product "H350 RGB" "H350+RGB+headset" ""
process_product "H386" "H386+headset" "diomedes-h386"
process_product "H510-fb" "H510+zeus+headset" "h510-zeus"
process_product "H510RGB" "H510+zeus+RGB+headset" "h510-zeus"

# ============================================================
# === EXISTING GAMEPADS ===
# ============================================================
log "--- GAMEPADS ---"
process_product "G711" "G711+controller" ""
process_product "G712" "G712+controller" ""
process_product "G713" "G713+controller" ""
process_product "g808 pro" "G808+PRO+controller" ""

# ============================================================
# === EXISTING COMBOS ===
# ============================================================
log "--- COMBOS ---"
process_product "S01-5" "S101+combo" "s101-5-gaming-combination-set"
process_product "S101W" "S101W+white+combo" ""
process_product "S101-BA" "S101+BA+combo" ""
process_product "S107" "S107+combo" ""

# ============================================================
# === EXISTING ACCESSORIES ===
# ============================================================
log "--- ACCESSORIES ---"
process_product "GS520" "GS520+speaker" ""
process_product "GMK914" "GMK914+monitor+mount" ""
process_product "GMK-913" "GMK913+monitor" ""
process_product "P037" "P037+mousepad" ""
process_product "GM100" "GM100+mousepad" ""
process_product "GM200" "GM200+mousepad" ""
process_product "GCP500" "GCP500+laptop+cooler" ""
process_product "GCP511" "GCP511+laptop+cooler" ""
process_product "GW900 APEX" "GW900+webcam" ""

# ============================================================
# === NEW PRODUCTS FROM PDF — MICE ===
# ============================================================
log "--- NEW MICE FROM PDF ---"
add_new_product "M801" "MAMMOTH M801 Gaming Mouse" "Mouse" "mammoth-m801"
add_new_product "M901" "PERDITION M901 Gaming Mouse" "Mouse" "perdition-m901"
add_new_product "M901P-KS" "PERDITION ELITE M901P Gaming Mouse" "Mouse" ""
add_new_product "M901P-WS" "PERDITION ELITE M901P White Gaming Mouse" "Mouse" ""
add_new_product "M903P" "M903P Pink Gaming Mouse" "Mouse" ""
add_new_product "M915WL-RGB" "SWAIN M915WL Wireless Gaming Mouse" "Mouse" ""
add_new_product "M990" "LEGEND M990 Gaming Mouse" "Mouse" "legend-m990"

# ============================================================
# === NEW PRODUCTS FROM PDF — KEYBOARDS ===
# ============================================================
log "--- NEW KEYBOARDS FROM PDF ---"
add_new_product "K506" "K506 Gaming Keyboard" "Keyboard" ""
add_new_product "K515 RGB" "K515 RGB Gaming Keyboard" "Keyboard" ""
add_new_product "K515 PRO" "K515 PRO Gaming Keyboard" "Keyboard" ""
add_new_product "K516 PRO" "K516 PRO Gaming Keyboard" "Keyboard" ""
add_new_product "KG010-KN" "KG010 Gaming Keyboard" "Keyboard" ""
add_new_product "KG010-WN" "KG010 White Gaming Keyboard" "Keyboard" ""
add_new_product "K535" "K535 Gaming Keyboard" "Keyboard" ""
add_new_product "K539" "K539 White Gaming Keyboard" "Keyboard" ""
add_new_product "K550" "K550 Purple Switch Gaming Keyboard" "Keyboard" ""

# ============================================================
# FINAL PUSH
# ============================================================
log "=== ALL PRODUCTS PROCESSED. FINAL PUSH ==="
cd "$DEPLOY"
git add data/products.json SKIPPED.md
git commit -m "COMPLETE: all CDN images, software, manuals, new products from PDF"
git push origin fresh_deploy:main --force
log "=== DONE. Check SKIPPED.md for items that need manual attention ==="
