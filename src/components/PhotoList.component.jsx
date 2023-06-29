import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Modal, Spin } from "antd";
import "./PhotoList.css";

const PhotoList = ({ searchText }) => {
  const [photosArray, setPhotosArray] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  const fetchImageData = debounce(() => {
    const apiKey = "6a8ba2b800fb972f539c5a086b465c6a";

    let photoMethod;
    if (searchText.trim() === "") {
      photoMethod = "getRecent";
    } else {
      photoMethod = "search";

      const storedHistory = JSON.parse(
        localStorage.getItem("photoSearchHistory")
      );

      if (!storedHistory?.includes(searchText.toLowerCase())) {
        if (localStorage.getItem("photoSearchHistory")) {
          localStorage.setItem(
            "photoSearchHistory",
            JSON.stringify([searchText, ...storedHistory])
          );
        } else {
          localStorage.setItem(
            "photoSearchHistory",
            JSON.stringify([searchText])
          );
        }
      }
    }

    let data = {
      method: `flickr.photos.${photoMethod}`,
      api_key: apiKey,
      format: "json",
      nojsoncallback: 1,
      safe_search: "1",
    };

    if (searchText.trim() !== "") data = { ...data, tags: searchText };

    const parameters = new URLSearchParams(data);

    const url = `https://api.flickr.com/services/rest/?${parameters}`;
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        const photoCollectionObj = response.photos.photo;
        const photosCollectionArr = photoCollectionObj?.map((value) => {
          return `https://live.staticflickr.com/${value.server}/${value.id}_${value.secret}.jpg`;
        });
        setIsDataLoading(false);
        setPhotosArray(photosCollectionArr);
      })
      .catch((error) => {
        setIsDataLoading(false);
        setPhotosArray([]);
        console.log(error);
      });
  }, 1000);

  useEffect(() => {
    setIsDataLoading(true);

    fetchImageData();

    return () => {
      fetchImageData.cancel();
    };
  }, [searchText.trim().toLowerCase()]);

  const showModal = (img) => {
    setModalImage(img);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalImage("");
  };

  return isDataLoading ? (
    <div>
      <Spin tip="Loading" size="large" className="Spinner">
        <div />
      </Spin>
    </div>
  ) : !isDataLoading && photosArray.length > 0 ? (
    <div className="PhotoListContainer">
      {photosArray?.map((photo, index) => (
        <div
          key={index}
          className="PhotoParent"
          onClick={() => showModal(photo)}
        >
          <img
            src={photo}
            alt="img"
            width={"220px"}
            height={"220px"}
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        width={"500px"}
        footer={null}
        closable={false}
      >
        <div className="ModalImageParent">
          <img src={modalImage} alt="img" width={"450px"} />
        </div>
      </Modal>
    </div>
  ) : (
    <div>
      <h3 align="center">No images found</h3>
    </div>
  );
};

export default PhotoList;
