# Playing with Open AI api

> Hayek, F. A. (1945). The use of knowledge in society. _The American Economic Review_, 35(4), 519-530.

This article was recommended in one of the podcast I was listening, but I find it very annoying to read of old pdfs on my phone :D so I figured I'll using OpenAI for OCR job. And as far as I can tell, it did a great job !

## Steps

Split pdf into single pages

```BASH
pdfseparate raw/Hayek_45.pdf page_%d.pdf
```

Some clean up, non essential

```BASH
for i in {2..9}; do mv "page_${i}.pdf" "page_0${i}.pdf";done
```
```BASH
for p in page_*.pdf; do pdfimages -all -list $p;done
```

Convert pdf to png

```BASH
for p in page_*.pdf; do convert -density 600 $p $(basename $p .pdf).png;done
```

```BASH
python -m pip install openai
```

```BASH
python image_to_text.py
```