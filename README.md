
```BASH
pdfseparate raw/Hayek_45.pdf page_%d.pdf
for i in {2..9}; do mv "page_${i}.pdf" "page_0${i}.pdf";done
for p in page_*.pdf; do pdfimages -all -list $p;done
for p in page_*.pdf; do convert -density 600 $p $(basename $p .pdf).png;done
```