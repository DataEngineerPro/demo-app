import { useEffect, useState } from 'react';
import {
  CanvasContextProvider,
  useCanvasContext,
} from '../canvas/context/context';
import Canvas from '../canvas/canvas';
import ThubmnailSlider from '../thumbnail-slider/thubmnail-slider';
import LabelStack from '../labels/label-stack';
import DataHolder from '../data-holder/data-holder';
import LoadingComponent from '../loading/loading';
import './workspace.scss';

function Workspace({ page, boundingBoxes, labels, images, sessionId }) {
  const { data, setInitialData, updatePage } = useCanvasContext();
  const [loading, setLoading] = useState(false);
  const [showBoundingBox, setShowBoundingBox] = useState<number | null>(null);
  const [image, setImage] = useState(images.find((x) => x.page === page));
  const fetchData = async (page: number) => {
    const boundingBoxes = await fetch(
      import.meta.env.VITE_API_PREFIX +
        '/api/retrive_bbox?id=' +
        sessionId +
        '&page_no=' +
        page
    ).then((data) => data.json());
    if (boundingBoxes.length > 0) {
      const newBoundingBoxes = boundingBoxes.map((x: any, index: number) => {
        return {
          rect: {
            x: x.left,
            y: x.top,
            width: x.width,
            height: x.height,
          },
          id: index + 1,
          label: x.label_name
            ? labels.find((l) => l.text === x.label_name).id
            : 1,
          text: x.ocr_text,
          comment: x.comments,
        };
      });
      console.log('NEW BOUNDINGBOX ==>', newBoundingBoxes);
      updatePage({
        page: page,
        rects: newBoundingBoxes,
      });
    } else {
      updatePage({
        page: page,
        rects: [],
      });
    }
    setImage(images.find((x) => x.page === page));
  };
  useEffect(() => {
    setInitialData({
      rects: boundingBoxes,
      labels: labels,
      document: images,
      page: page || 1,
    });
  }, [page, boundingBoxes, labels, images]);
  useEffect(() => {
    console.log('DATA=>', data);
  }, [data]);
  const pageChange = (newPage: number) => {
    fetchData(newPage);
  };
  return (
    <div className="row bodycontainer">
      <div className="col-1 left-panel m-0 p-0">
        <ThubmnailSlider pageChange={pageChange}></ThubmnailSlider>
      </div>

      <div className="ms-3 col-7 p-0">
        {!loading && (
          <Canvas
            labels={labels}
            rects={boundingBoxes}
            document={image}
            showUpload={false}
            id={sessionId}
            openContextMenu={showBoundingBox}
            closeContextMenu={() => setShowBoundingBox(null)}
          ></Canvas>
        )}
        {loading && <LoadingComponent></LoadingComponent>}
      </div>

      <div className="col ms-3 right-panel bg-light">
        <div className="d-flex flex-column mb-2">
          <h6>
            How to Get Started with Lumen AI Demo Version: Your Easy Guide{' '}
          </h6>
          <ul className="ollist">
            <li className="m-0 p-0">
              Start by creating a new label for each data field or table you
              wish to extract. Then, select the specific area on the page where
              these fields or tables are located.
            </li>
            <li className="m-0 p-0">
              Assign labels to each field or table. Feel free to add any
              optional comments to specify special processing needs, such as
              data quality checks or transformations post extraction.
            </li>
            <li className=" m-0 p-0">
              After labeling all fields, submit your worksheet. This lets us
              know exactly what you need, so we can begin tailoring a Machine
              Learning model just for you.
            </li>
            <li className="m-0 p-0">
              For demo versions, model preparation is swift - generally
              completed in under 4 hours. Our customer support team will keep
              you in the loop and inform you the moment your model is ready.
            </li>
            <li className=" m-0 p-0">
              Once your model is trained, it's all set to efficiently process
              bulk quantities of similar documents. Efficient, effective, and
              tailored just for you!
            </li>
          </ul>
        </div>
        <div className="label-holder">
          <div className="d-flex flex-row align-items-baseline">
            <h6>Labels Legend</h6>
          </div>
          <LabelStack sessionId={sessionId} />
        </div>
        <div className="d-flex flex-row align-items-baseline">
          <h6>Identified Labels</h6>
        </div>
        <div className="data-holder">
          <DataHolder
            showUpload={false}
            showContextMenu={setShowBoundingBox}
            sessionId={sessionId}
          />
        </div>
      </div>
    </div>
  );
}
const withContext = (Component: React.FC<any>) => {
  return (props: any) => (
    <CanvasContextProvider>
      <Component {...props} />
    </CanvasContextProvider>
  );
};
export default withContext(Workspace);
