import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { TbHomeDollar } from 'react-icons/tb';
import { LiaDonateSolid } from 'react-icons/lia';
import ImageSelector from './ImageSelector/index';
import axiosClient from 'axiosClient';
import { HiDownload } from 'react-icons/hi';
import { CiCircleCheck } from 'react-icons/ci';

interface filesType {
  preliminary_access: undefined | File;
  credit_proposal: undefined | File;
}

interface imagesType {
  imagesData: string[];
  selectedImage: number;
}

function App() {
  const [files, setFiles] = useState<filesType>({
    preliminary_access: undefined,
    credit_proposal: undefined,
  });

  const [address, setAddress] = useState('5 Marks St., Bendigo VIC 3550');
  const [addressImages, setAddressImages] = useState<imagesType>({
    imagesData: [],
    selectedImage: -1,
  });
  const [generatedDoc, setGeneratedDoc] = useState<string>('');

  const handleFileSelect = (selectedFiles: File, file_type: string) => {
    if (file_type === 'preliminary_access') {
      setFiles({
        ...files,
        preliminary_access: selectedFiles,
      });
    } else {
      setFiles({
        ...files,
        credit_proposal: selectedFiles,
      });
    }
  };

  const handleGetPictures = () => {
    axiosClient
      .post('/pictures', {
        address: address,
      })
      .then((res: any) => {
        setAddressImages({
          ...addressImages,
          imagesData: res.data.result.fileNames,
        });
      })
      .catch((error: any) => {
        console.log("Error occurred during get address's pictures", error);
      });
  };

  const handleGenerate = () => {
    const formData = new FormData();
    if (files.preliminary_access && files.credit_proposal && addressImages.selectedImage >= 0) {
      formData.append('files', files.preliminary_access);
      formData.append('files', files.credit_proposal);
      formData.append('picture_path', addressImages.imagesData[addressImages.selectedImage]);
      axiosClient
        .post('/generate-doc', formData)
        .then((res) => setGeneratedDoc(res.data.result.docPath))
        .catch((error) => console.log('Error occurred during generating file:', error));
    } else {
      window.alert('Please select docs and image.');
    }
  };

  const downloadFunction = async () => {
    try {
      const response = await axiosClient.get(`/download?full_path=${generatedDoc}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', generatedDoc);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="mt-2 flex max-h-screen flex-col items-center justify-center p-2 lg:p-10">
      <div className="mb-4 text-2xl font-bold">Finance Strategy Generator</div>
      <div className="flex w-full max-w-4xl flex-col gap-4 sm:flex-row sm:justify-between">
        <FileUpload
          title="Preliminary Assessment Doc"
          file_type="preliminary_access"
          icon={<TbHomeDollar />}
          onFileSelect={handleFileSelect}
        />
        <FileUpload
          title="Credit Proposal Doc"
          file_type="credit_proposal"
          icon={<LiaDonateSolid />}
          onFileSelect={handleFileSelect}
        />
      </div>
      <input
        type="text"
        placeholder="Property Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="mt-4 w-full max-w-4xl rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
      />
      <button
        onClick={handleGetPictures}
        className="mx-4 mt-4 rounded-lg border border-blue-500 bg-white px-4 py-2 text-blue-500 hover:bg-blue-100 focus:outline-none"
      >
        Get pictures
      </button>
      <ImageSelector
        onSelect={(imageIndex) => setAddressImages({ ...addressImages, selectedImage: imageIndex })}
        addressImages={addressImages}
      />
      {files.credit_proposal && files.preliminary_access && addressImages.selectedImage >= 0 && (
        <button
          onClick={handleGenerate}
          className="mx-4 mt-4 rounded-lg border bg-blue-500 px-4 py-2 text-white hover:bg-blue-400 focus:outline-none"
        >
          Generate
        </button>
      )}
      {!!generatedDoc && (
        <div className="p-auto my-[40px] flex min-h-[270px] w-[740px] flex-col items-center justify-center rounded-[8px] bg-[#F5F5F5]">
          <CiCircleCheck className="mr-1 text-[48px] text-blue-500" />
          <p className="text-[32px] font-bold">Your report has been generated</p>
          <button
            onClick={downloadFunction}
            className="mx-4 mt-4 flex items-center justify-center rounded-lg border bg-blue-500 px-4 py-2 text-white hover:bg-blue-400 focus:outline-none"
          >
            <HiDownload className="mr-1 text-lg text-white" />
            <span className="text-white">Download</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
