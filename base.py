# %%
import os
from pathlib import Path
import base64
from openai import OpenAI
from dotenv import load_dotenv
# %%
load_dotenv()
# %%
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
# %%
base64_imgs = []

data_dir = Path("data")
for image_path in sorted(data_dir.glob("*.png")):
    print(f"MSG: Encoding -> {image_path.stem}")
    base64_imgs.append((image_path.stem, encode_image(image_path)))

base64_imgs
# %%
client = OpenAI(
    api_key=os.getenv("OPENAI_KEY"),
    organization=os.getenv("OPENAI_ORG"),
)

def get_ai_response(client, img):

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    { "type": "text", "text": "Return all text form the image. Structure the text as markdown document" },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{img}",
                        },
                    },
                ],
            }
        ],
    )

    return completion.choices[0].message.content
# %%
for stem, img in base64_imgs:
    print(f"MSG: Processing -> {stem}")
    text = get_ai_response(client, img)
    fn_out = f"{stem}.md"
    with open(fn_out, 'w') as f:
        f.write(text)