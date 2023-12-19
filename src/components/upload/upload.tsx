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
  const [session_id, setSession_id] = useState<string>(null);
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
      if (e.dataTransfer.files[0].size > import.meta.env.VITE_MAX_FILE_SIZE_IN_MB*1024*1024) {
        alert(`File size should not be more than ${import.meta.env.VITE_MAX_FILE_SIZE_IN_MB}MB`);
        setLoading(false);
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append('file', e.dataTransfer.files[0]);
      const response = await fetch(
        import.meta.env.VITE_API_PREFIX + '/api/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      if (response.ok) {
        const resp = await response.json();
        props.uploadComplete(resp[0].id);
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
      //check the size of file uploaded and show error if it is more than 2MB
      if (e.target.files[0].size > import.meta.env.VITE_MAX_FILE_SIZE_IN_MB*1024*1024) {
        alert(`File size should not be more than ${import.meta.env.VITE_MAX_FILE_SIZE_IN_MB}MB`);
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const response = await fetch(
        import.meta.env.VITE_API_PREFIX + '/api/upload?id=' + session_id,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (response.ok) {
        const resp = await response.json();
        props.uploadComplete(resp[0].id);
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
    // console.log(import.meta.env.API_PREFIX);
    //fetch(import.meta.env.API_PREFIX)
  };

  const formsubmit = (id: string) => {
    setShowContact(false);
    setSession_id(id);
    props.contactComplete();
  };
  return (
    <>
      <div className="row upload-container my-0">
        <div className="col-6 d-flex justify-content-center align-items-center left-col">
          &nbsp;
        </div>

        <div className="col-6 align-items-center d-flex justify-content-center m-auto flex-column">
          {loading && <LoadingComponent></LoadingComponent>}
          {showContact && <ContactForm submit={formsubmit}></ContactForm>}
          <form
            className={`my-5 ${
              loading || showContact ? 'visually-hidden' : ''
            }`}
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
              accept="image/*,application/pdf"
            />
            <label
              id="label-file-upload"
              htmlFor="input-file-upload"
              className={dragActive ? 'drag-active' : ''}
            >
              <div>
                <h4>Start by uploading a file</h4>
                <p>Supported file formats : png, jpg, jpeg and pdf</p>
                {/* <p>to create a project for optimal result.</p>
              
              */}
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
                      Add File
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item disabled={true}>
                      Add folders (available only in Pro version)
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div className="m-3">
                  Free trial version will support only files upto {import.meta.env.VITE_MAX_FILE_SIZE_IN_MB}MB in size and only 1st page of the uploaded
                  file for model training.
                </div>
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
      </div>
    </>
  );
}

export default UploadComponent;
