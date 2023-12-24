import axios from 'axios';

export const checkImage = (file) => {
  let err = '';
  if (!file) return (err = 'File does not exist.');

  if (file.size > 1024 * 1024 * 200)
    // 10mb
    err = 'The largest image size is 200mb.';

  if (file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = 'Image format is incorrect.';

  return err;
};

export const imageUpload = async (file) => {
  let imgArr = [];
  let fileName = '';

  if (file) {
    for (const item of file) {
      const data = new FormData();
      if (item.type.match(/video/i)) {
        fileName = Date.now() + 'video ' + item.name;
      } else {
        fileName = Date.now() + item.name;
      }

      data.append('name', fileName);
      data.append('file', item);
      try {
        await axios.post('/api/upload', data);
        //imgArr.push({ url: res.data.url });
        imgArr.push({ url: fileName });
      } catch (err) {}
      //imgArr.push({ url: 'http://localhost:5000/images/' + fileName });
    }
  }
  return imgArr;
};

export const deletefile = (file) => {
  console.log('file', file);
  for (const item of file) {
    // var pathname = new URL(item.url).pathname;
    // var image = pathname.substring(8);
    console.log('fileclinte2', item.url);
    try {
      axios.delete(`/api/delete/${item.url}`);
    } catch (err) {
      console.log(err);
    }
  }
};
//   console.log('images', images);
//   let imgArr = [];
//   for (const item of images) {
//     const formData = new FormData();

//     if (item.camera) {
//       formData.append('file', item.camera);
//     } else {
//       formData.append('file', item);
//     }

//     formData.append('upload_preset', 'efxjficn');
//     formData.append('cloud_name', 'devat-channel');

//     const res = await fetch(
//       'https://api.cloudinary.com/v1_1/devat-channel/upload',
//       {
//         method: 'POST',
//         body: formData,
//       }
//     );

//     const data = await res.json();
//     imgArr.push({ public_id: data.public_id, url: data.secure_url });
//   }
//   console.log('imagessolve', imgArr);
//   return imgArr;

// };
