import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import './intro.scss';

function IntroComponent(props: any) {
  console.log('props', props);

  const onExit = () => {
    console.log('Exit Called');
  };
  const steps = [
    {
      element: '.label-input',
      intro:
        'Start by creating a new label for each data field or table you wish to extract.',
      position: 'left',
    },
    {
      element: '.thumbnail-container',
      intro: 'Identify the page where the fields or tables are located',
      position: 'right',
    },
    {
      element: '.konvajs-content',
      intro: CanvasIntroComponent(),
      position: 'right',
      tooltipClass: 'customTooltip',
    },
    {
      element: '.label-table',
      intro:
        'After labeling all fields, submit your worksheet. This lets us know exactly what you need, so we can begin tailoring a Machine Learning model just for you.',
      position: 'left',
    },
    {
      intro: GeneralInstructions(),
      position: 'center',
    },
    {
      element: '.instructions',
      intro: 'If you need to refer to instructions again, refer to this text',
      position: 'left',
    },
  ];
  return (
    <Steps
      enabled={props.hintsEnabled}
      steps={steps}
      initialStep={0}
      onExit={onExit}
      options={{ hideNext: false }}
    />
  );
}

function CanvasIntroComponent() {
  return (
    <div>
      <div>
        <img
          className="img-fluid"
          src="https://user-images.githubusercontent.com/14011726/94132137-7d4fc100-fe7c-11ea-8512-69f90cb65e48.gif"
        />
      </div>
      <div>
        <ul className="ollist">
          <li className="m-0 p-0">
            Take your cursor to the upper left corner of the relevant datapoint,
            and drag the cursor to select the required portion.
          </li>
          <li className=" m-0 p-0">
            Assign labels to each field or table. Feel free to add any optional
            comments to specify special processing needs, such as data quality
            checks or transformations post extraction.
          </li>
        </ul>
      </div>
    </div>
  );
}
function GeneralInstructions() {
  return (
    <ul className="ollist">
      <li className=" m-0 p-0">
        For demo versions, model preparation is swift - generally completed in
        under 4 hours. Our customer support team will keep you in the loop and
        inform you the moment your model is ready.
      </li>
      <li className=" m-0 p-0">
        Once your model is trained, it's all set to efficiently process bulk
        quantities of similar documents. Efficient, effective, and tailored just
        for you!
      </li>
    </ul>
  );
}

export default IntroComponent;
