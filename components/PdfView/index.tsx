// import React, { use, useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import { useEffect } from "react";

// const PdfView = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [pdfDataUri, setPdfDataUri] = useState<string | null>(null);
//   const uploadFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFile(event.target.files[0]);
//     }
//   };
//   useEffect(() => {
//     const convertToBytes = async () => {
//       if (!file) return;
//       const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
//       const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
//       setPdfDataUri(pdfDataUri);
//     };
//     convertToBytes();
//   }, [file]);

//   return (
//     <>
//       {!pdfDataUri && <input type="file" onChange={uploadFileHandler} />}
//       {pdfDataUri && (
//         <div>
//           <iframe src={pdfDataUri} width="50%" height="200px" />
//         </div>
//       )}
//     </>
//   );
// };

// export default PdfView;
import React, { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();
}

const options = {
  cMapUrl: "cmaps/",
  standardFontDataUrl: "standard_fonts/",
};

type PDFFile = string | File | null;

export default function PdfView() {
  const [file, setFile] = useState<PDFFile>("./sample.pdf");
  const [numPages, setNumPages] = useState<number>();

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (files && files[0]) {
      setFile(files[0] || null);
    }
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
    setNumPages(nextNumPages);
  }

  return (
    <div className="Example">
      <header>
        <h1>react-pdf sample page</h1>
      </header>
      <div className="Example__container">
        <div className="Example__container__load">
          <label htmlFor="file">Load from file:</label>{" "}
          <input onChange={onFileChange} type="file" />
        </div>
        <div className="Example__container__document">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
