import axios from "axios";
import {
  Button,
  Checkbox,
  Datepicker,
  FileInput,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import React, { useState, useEffect } from "react";

const DataInsertModal = ({
  title,
  fields,
  openModal,
  onCloseModal,
}: {
  title: string;
  fields: { name: string; type: string; options?: string[] }[];
  openModal: boolean;
  onCloseModal: () => void;
}) => {
  const [formData, setFormData] = useState<{
    [key: string]: string | string[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [parentEvents, setParentEvents] = useState<
    { _id: string; title: string }[]
  >([]);
  const [parentEventId, setParentEventId] = useState<string>("");

  const handleChange = (fieldName: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Fetch parent events on mount
  useEffect(() => {
    const fetchParentEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/event`
        );
        const parents = response.data.filter((ev: any) => ev.type === "parent");
        setParentEvents(
          parents.map((e: any) => ({ _id: e._id, title: e.title }))
        );
      } catch (e) {
        setParentEvents([]);
      }
    };
    fetchParentEvents();
  }, []);
  const handleCheckboxChange = (
    fieldName: string,
    option: string,
    checked: boolean
  ) => {
    setFormData((prevData) => {
      const currentValues = Array.isArray(prevData[fieldName])
        ? (prevData[fieldName] as string[])
        : [];

      if (checked) {
        return {
          ...prevData,
          [fieldName]: [...currentValues, option],
        };
      } else {
        return {
          ...prevData,
          [fieldName]: currentValues.filter((value) => value !== option),
        };
      }
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Add parentEventId to formData if present
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
        formData.append(
          "fileName",
          `${title}-${formData.get(title)}-${Date.now()}`
        );
        formData.append(
          "folder",
          `/Prabhupada_Network/${title.toLocaleLowerCase()}s`
        );
        formData.append("signature", signature);
        formData.append("expire", expire);
        formData.append("token", imageKitToken);
        formData.append(
          "publicKey",
          process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
        );
        const uploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}`,
          formData
        );
        const imageUrl = uploadResponse.data.url;
        setFormData((prevData) => ({
          ...prevData,
          imageUrl: imageUrl,
        }));
      } catch (error: any) {
        setError(error.response.data.message);
        console.error("Image Upload Failed: ", error);
      }
    }
    try {
      const submitData = { ...formData };
      if (parentEventId) submitData.parentEventId = parentEventId;

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${title.toLowerCase()}`,
        submitData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`${title === "Join-Us" ? "You are" : title} added successfully`);
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
          {title === "Event" && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-fontApp mb-1">
                Event Type
              </label>
              <Select
                value={formData["type"] || ""}
                onChange={(e) => handleChange("type", e.target.value)}
                required
              >
                <option value="">Select type</option>
                <option value="parent">Parent Event</option>
                <option value="child">Child Event</option>
              </Select>
            </div>
          )}

          {/* Show parent event dropdown if not creating a parent event */}
          {title === "Event" && formData["type"] === "child" && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-fontApp mb-1">
                Select Parent Event
              </label>
              <Select
                value={parentEventId}
                onChange={(e) => setParentEventId(e.target.value)}
              >
                <option value="">No Parent</option>
                {parentEvents.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {fields.map(
            (field: { name: string; type: string; options?: string[] }) => (
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

                {field.type === "img" && (
                  <FileInput
                    id={field.name}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                )}
                {field.type === "checkbox" && field.options && (
                  <div className="space-y-2">
                    <div className="block text-sm font-medium text-fontApp">
                      {field.name}
                    </div>
                    <div>
                      {field.options.map((option) => (
                        <div key={option} className="flex items-center">
                          <Checkbox
                            id={`${field.name}-${option}`}
                            checked={
                              Array.isArray(formData[field.name]) &&
                              (formData[field.name] as string[]).includes(
                                option
                              )
                            }
                            onChange={(e) =>
                              handleCheckboxChange(
                                field.name,
                                option,
                                e.target.checked
                              )
                            }
                          />
                          <label
                            htmlFor={`${field.name}-${option}`}
                            className="ml-2 text-sm text-fontApp"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {field.type === "date" && (
                  <Datepicker
                    id={field.name}
                    aria-label={`Enter ${field.name}`}
                    placeholder={`Enter ${field.name}`}
                    value={
                      typeof formData[field.name] === "string" &&
                      formData[field.name]
                        ? new Date(formData[field.name] as string)
                        : new Date("1966-01-01")
                    }
                    onChange={(date) =>
                      handleChange(field.name, date ? date.toISOString() : "")
                    }
                    className="absolute"
                    required
                  />
                )}
              </div>
            )
          )}

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
