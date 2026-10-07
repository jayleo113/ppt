"""从报告原文中裁出 PPT 用图（一次性运行，结果存入 build/assets/）。

用法：python3 build/prepare_images.py <报告封面 PNG> <Daily TV usage 原图 JPG>
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).parent / "assets"
NAVY = (0x1F, 0x2A, 0x44)
ORANGE = (0xD9, 0x54, 0x2B)
cover_src, chart_src = Path(sys.argv[1]), Path(sys.argv[2])

# 1) 报告封面缩略图（第 3 页）
cover = Image.open(cover_src).convert("RGB")
thumb = cover.copy()
thumb.thumbnail((1200, 1200))
thumb.save(OUT / "report_cover.jpg", quality=90)

# 2) 封面右侧满版图：截取电视画面，左缘渐变融入深蓝底色（第 1 页）
W, H = cover.size
ratio = 6.33 / 7.5  # 版面上图片区域的宽高比
cw = int(W * 0.5)
ch = min(H, int(cw / ratio))
x0, y0 = W - cw, (H - ch) // 2
hero = cover.crop((x0, y0, x0 + cw, y0 + ch)).resize((1080, int(1080 / ratio)))
navy = Image.new("RGB", hero.size, NAVY)
mask = Image.new("L", hero.size, 0)
draw = ImageDraw.Draw(mask)
fade = int(hero.width * 0.35)
for x in range(fade):  # 左侧 35% 由深蓝过渡到原图
    draw.line([(x, 0), (x, hero.height)], fill=int(255 * (1 - x / fade) ** 1.6))
hero = Image.composite(navy, hero, mask)
hero.save(OUT / "cover_hero.jpg", quality=88)

# 3) 报告原图《Daily TV usage》：用橙框标出六国均值“0:14”（第 9 页）
chart = Image.open(chart_src).convert("RGB")
d = ImageDraw.Draw(chart)
d.rounded_rectangle((96, 194, 200, 257), radius=8, outline=ORANGE, width=4)
chart.save(OUT / "daily_tv_usage_marked.jpg", quality=92)
print("ok", hero.size, chart.size)
