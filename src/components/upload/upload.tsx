import { useRef, useState } from 'react';
import './upload.scss';
import { Dropdown } from 'react-bootstrap';
import LoadingComponent from '../loading/loading';
import ContactForm from '../contact/contact';
import { Upload } from 'react-feather';

// drag drop file component
function UploadComponent(props: any) {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(props.showContact);
  // ref
  const inputRef = useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      if (e.dataTransfer.files.length > 1) {
        alert('Only single image file is supported');
        return;
      }
      if (
        e.dataTransfer.files[0] &&
        e.dataTransfer.files[0].type.indexOf('image') !== 0
      ) {
        alert('Only single image file is supported');
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append('file', e.dataTransfer.files[0]);
      const response = await fetch(import.meta.env.VITE_API_PREFIX + 'upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const resp = await response.json();
        props.uploadComplete(resp.id);
      } else {
        setLoading(false);
        alert('Problem occured with upload, please try again');
      }
    }
  };

  // triggers when file is selected with click
  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // handleFiles(e.target.files);
      setLoading(true);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const response = await fetch(import.meta.env.VITE_API_PREFIX + 'upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const resp = await response.json();
        props.uploadComplete(resp.id);
      } else {
        setLoading(false);
        alert('Problem occured with upload, please try again');
      }
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const formSubmit = (e) => {
    e.preventDefault();
    console.log(import.meta.env.API_PREFIX);
    //fetch(import.meta.env.API_PREFIX)
  };

  return (
    <>
      <div className="align-items-center d-flex justify-content-center m-auto upload-container w-50 flex-column">
        {loading && <LoadingComponent></LoadingComponent>}
        {showContact && (
          <ContactForm submit={() => setShowContact(false)}></ContactForm>
        )}
        <form
          className={`my-5 ${loading || showContact ? 'visually-hidden' : ''}`}
          id="form-file-upload"
          onDragEnter={handleDrag}
          onSubmit={formSubmit}
        >
          <input
            ref={inputRef}
            type="file"
            id="input-file-upload"
            multiple={false}
            onChange={handleChange}
            accept="image/*"
          />
          <label
            id="label-file-upload"
            htmlFor="input-file-upload"
            className={dragActive ? 'drag-active' : ''}
          >
            <div>
              <h4>Start by uploading a file</h4>
              <p>to create a project for optimal result.</p>
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="btn-outline-dark"
                >
                  <Upload size={18}></Upload>&nbsp; Upload files or folders
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={onButtonClick}>
                    Add File (image file upto 5MB)
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item disabled={true}>
                    Add folders (available only in Pro version)
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </label>
          {dragActive && (
            <div
              id="drag-file-element"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            ></div>
          )}
        </form>
      </div>
    </>
  );
}

export default UploadComponent;
