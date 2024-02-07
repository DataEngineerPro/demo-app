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
import IntroComponent from '../intro/intro';

function Workspace() {
  const { data, setInitialData, updatePage } = useCanvasContext();
  const [loading, setLoading] = useState(false);
  const [showBoundingBox, setShowBoundingBox] = useState<number | null>(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const [page, setPage] = useState(1);
  const sessionId = "temp";
  const [image, setImage] = useState({
    "displayUrl": "/assets/sample.png",
    "width": 2550,
    "page": 1,
    "url": "https://lumenai-demo.s3.amazonaws.com/de2be97e-4406-4e53-a194-f38b5615ca15/entity_relationship_diagram_jpg_bw.png",
    "height": 3301
  });
  const [hintsEnabled, setHintsEnabled] = useState(false);
  useEffect(() => {
    setInitialData({
      extractions:[],
      labels: [],
      document: [{
        "displayUrl": "/assets/sample.png",
        "width": 2550,
        "page": 1,
        "url": "https://lumenai-demo.s3.amazonaws.com/de2be97e-4406-4e53-a194-f38b5615ca15/entity_relationship_diagram_jpg_bw.png",
        "height": 3301
      }],
      page: page || 1,
    });
    setTimeout(() => {
      setHintsEnabled(true);
    }, 300);
  }, []);
  useEffect(() => {
    setPage(data.page);
  }, [data]);
  const pageChange = (newPage: number) => {
    updatePage(newPage);
    setImage(images.find((x) => x.page === newPage));
    document.querySelector('.bodycontainer').scrollTo(0, 0);
  };
  const updateHeight = (h) => {
    setMaxHeight(h);
  };
  return (
    <div className="row bodycontainer">
      <IntroComponent
        hintsEnabled={hintsEnabled}
        setHintsEnabled={setHintsEnabled}
      ></IntroComponent>
      <div className="col-1 left-panel m-0 p-0">
        <ThubmnailSlider
          height={maxHeight}
          pageChange={pageChange}
        ></ThubmnailSlider>
      </div>

      <div className="ms-3 col-7 p-0">
        {!loading && (
          <Canvas
            labels={[]}
            extracions={[]}
            document={image}
            showUpload={false}
            id={"temp"}
            openContextMenu={showBoundingBox}
            closeContextMenu={() => setShowBoundingBox(null)}
            updateHeight={updateHeight}
          ></Canvas>
        )}
        {loading && <LoadingComponent></LoadingComponent>}
      </div>

      <div className="col ms-3 right-panel bg-light">
        <div className="instructions d-flex flex-column mb-2">
          <h6>
            How to Get Started with Lumen AI Demo Version: Your Easy Guide{' '}
          </h6>
          <ul className="ollist">
            <li className="m-0 p-0">
              Start by creating a new label for each data field or table you
              wish to extract.
            </li>
            <li className="m-0 p-0">
              Select the specific data on the page where these fields or tables
              are located. Take your cursor to the upper left corner of the
              relevant datapoint, and drag the cursor to select the required
              portion.
            </li>
            <li className=" m-0 p-0">
              Assign labels to each field or table. Feel free to add any
              optional comments to specify special processing needs, such as
              data quality checks or transformations post extraction.
            </li>
            <li className="m-0 p-0">
              After labeling all fields, submit your worksheet. This lets us
              know exactly what you need, so we can begin tailoring a Machine
              Learning model just for you.
            </li>
            <li className=" m-0 p-0">
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
            pageChange={pageChange}
            page={page}
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
