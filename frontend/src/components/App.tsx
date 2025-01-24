import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import { TbHomeDollar } from 'react-icons/tb';
import { LiaDonateSolid } from 'react-icons/lia';
import ImageSelector from './ImageSelector/index';
import axiosClient from 'axiosClient';
import { HiDownload } from 'react-icons/hi';
import { LuCircleX } from 'react-icons/lu';
import { CiCircleCheck } from 'react-icons/ci';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Loading from './Loading';
import "react-toastify/ReactToastify.css"
import { ToastContainer, toast } from 'react-toastify';

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

  const [loadingFlag, setLoadingFlag] = useState(false);
  const [address, setAddress] = useState('');
  const [addressImages, setAddressImages] = useState<imagesType>({
    imagesData: [],
    selectedImage: -1,
  });
  const [generatedDoc, setGeneratedDoc] = useState<string>('');

  const handleFileSelect = (
    selectedFiles: File | undefined,
    file_type: string,
  ) => {
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
    setGeneratedDoc('');
  };

  const handleGetPictures = () => {
    setLoadingFlag(true);
    setAddressImages({
      ...addressImages,
      imagesData: [],
    });
    axiosClient
      .post('/pictures', {
        address: address,
      })
      .then((res: any) => {
        setAddressImages({
          ...addressImages,
          imagesData: res.data.result.fileNames,
        });
        setLoadingFlag(false);
        toast.success("Successfully get address's pictures.")
      })
      .catch((error: any) => {
        console.log("Error occurred during get address's pictures", error);
        setLoadingFlag(false);
        toast.error("Error occurred during get address's pictures.")
      });
  };

  const handleGenerate = () => {
    setLoadingFlag(true);
    const formData = new FormData();
    if (files.preliminary_access && files.credit_proposal) {
      formData.append('files', files.preliminary_access);
      formData.append('files', files.credit_proposal);
      if (addressImages.selectedImage >= 0) {
        formData.append(
          'picture_path',
          addressImages.imagesData[addressImages.selectedImage],
        );
      }
      axiosClient
        .post('/generate-doc', formData)
        .then((res) => {
          setGeneratedDoc(res.data.result.docPath);
          setLoadingFlag(false);
          toast.success("Successfully generated financial document.")
        })
        .catch((error) => {
          console.log('Error occurred during generating file:', error);
          setLoadingFlag(false);
          toast.error("Error occurred during generated financial document.")
        });
    } else {
      window.alert('Please select docs and image.');
    }
  };

  const downloadFunction = async () => {
    try {
      const response = await axiosClient.get(
        `/download?full_path=${generatedDoc}`,
        {
          responseType: 'blob',
        },
      );
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
    <div className="flex min-h-screen flex-col items-center justify-center px-2 lg:px-10 relative">
      <ToastContainer
        position='top-right'
      />
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
        // className=""
        disabled={!address}
        className={twMerge(
          clsx(
            'mx-4 mt-4 rounded-lg border bg-white px-4 py-2  focus:outline-none ',
            'flex justify-center items-center',
            'text-blue-500 hover:bg-blue-100',
            {
              'hover:bg-white': !address,
            },
          ),
        )}
      >
        Get pictures
      </button>
      <ImageSelector
        onSelect={(imageIndex) => {
          setAddressImages({ ...addressImages, selectedImage: imageIndex });
          setGeneratedDoc('');
        }}
        addressImages={addressImages}
      />
      <button
        onClick={handleGenerate}
        disabled={!files.credit_proposal || !files.preliminary_access}
        className={twMerge(
          clsx(
            'mx-4 mt-4 rounded-lg border px-4 py-2 text-white  focus:outline-none',
            'hover:bg-blue-400 bg-blue-500',
            {
              'bg-blue-300 hover:bg-blue-300': !files.credit_proposal || !files.preliminary_access,
            },
          ),
        )}
      >
        Generate
      </button>
      <div className="w-[740px] min-h-[270px] p-auto flex flex-col justify-center items-center bg-[#F5F5F5] rounded-[8px] my-[40px]">
        {!!generatedDoc ? (
          <CiCircleCheck className="text-blue-500 text-[48px] mr-1" />
        ) : (
          <LuCircleX className="text-gray-500 text-[48px] mr-1" />
        )}
        <p className="text-[32px] font-bold">
          {!!generatedDoc
            ? 'Your report has been generated'
            : "Your report wasn't generated."}
        </p>
        <button
          onClick={downloadFunction}
          disabled={!generatedDoc}
          className={twMerge(
            clsx(
              'mx-4 mt-4 rounded-lg border px-4 py-2 text-white  focus:outline-none ',
              'flex justify-center items-center',
              'hover:bg-blue-400 bg-blue-500',
              {
                'bg-blue-300 hover:bg-blue-300':
                  !generatedDoc,
              },
            ),
          )}
        >
          <HiDownload className="text-white text-lg mr-1" />
          <span className="text-white">Download</span>
        </button>
      </div>
      {loadingFlag && (
        <div className="min-w-full min-h-full h-full absolute flex justify-center items-center bg-gray-500/25 inset-0 z-10">
          <Loading type="spin" color="#3b82f6" />{' '}
        </div>
      )}
    </div>
  );
}

export default App;
