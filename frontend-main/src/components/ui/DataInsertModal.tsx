import axios from "axios";
import {
  Button,
  Datepicker,
  FileInput,
  Modal,
  TextInput,
} from "flowbite-react";
import React, { useState } from "react";

const DataInsertModal = ({
  title,
  fields,
  openModal,
  onCloseModal,
}: {
  title: string;
  fields: { name: string; type: string }[];
  openModal: boolean;
  onCloseModal: () => void;
}) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const handleChange = (fieldName: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    if (selectedFile) {
      try {
        const signedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signed-url`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { signature, expire, token: imageKitToken } = signedResponse.data;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("signature", signature);
        formData.append("expire", expire);
        formData.append("token", imageKitToken);
        const uploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}`,
          formData
        );
        const imageUrl = uploadResponse.data.url;
        setFormData((prevData) => ({
          ...prevData,
          [imageUrl]: imageUrl,
        }));
      } catch (error: any) {
        setError(error.response.data.message);
        console.error("Image Upload Failed: ", error);
      }
    }
    try {
      console.log(formData);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${title.toLowerCase()}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`${title} added successfully`);
      onCloseModal();
    } catch (error: any) {
      setError(error.response.data.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal show={openModal} onClose={onCloseModal} size="md" popup>
      <Modal.Header />
      <Modal.Body>
        <div className="">
          <h3 className="text-xl font-medium text-fontApp pb-4">{title}</h3>
          {error && <div className="text-red-800">{error}</div>}
          {fields.map((field: { name: string; type: string }) => (
            <div key={field.name} className="mb-2 block">
              {field.type === "string" && (
                <TextInput
                  id={field.name}
                  aria-label={`Enter ${field.name}`}
                  placeholder={`Enter ${field.name}`}
                  value={formData[field.name] || ""}
                  onChange={(event) =>
                    handleChange(field.name, event.target.value)
                  }
                  required
                />
              )}
              {field.type === "date" && (
                <Datepicker
                  id={field.name}
                  aria-label={`Enter ${field.name}`}
                  placeholder={`Enter ${field.name}`}
                  value={
                    formData[field.name]
                      ? new Date(formData[field.name])
                      : new Date("1966-01-01")
                  }
                  onChange={(date) =>
                    handleChange(field.name, date ? date.toISOString() : "")
                  }
                  className="absolute"
                  required
                />
              )}
              {field.type === "img" && (
                <FileInput
                  id={field.name}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end w-full">
            <Button
              onClick={handleSubmit}
              className="bg-primary2 hover:text-fontApp"
              disabled={loading}
            >
              {loading ? `Adding ${title}` : `Add ${title}`}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DataInsertModal;
