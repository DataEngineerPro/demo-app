import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import './intro.scss';
import { Card, ListGroup } from 'react-bootstrap';

function IntroComponent(props: any) {
  const onExit = () => {
    props.setHintsEnabled(false);
  };
  const steps = [
    {
      element: '.label-input',
      intro:
        'Start by creating a new label for each data field or table you wish to extract.',
      position: 'left',
    },
    {
      element: '.selected-thumbnail',
      intro: 'Identify the page where the fields or tables are located',
      position: 'right',
    },
    {
      intro: CanvasIntroComponent(),
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
      tooltipClass: 'customTooltip',
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
    <Card>
      <Card.Img variant="top" src="/assets/label.gif" />
      <Card.Body>
        <Card.Title>Label Creation</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          Take your cursor to the upper left corner of the relevant datapoint,
          and drag the cursor to select the required portion.
        </ListGroup.Item>
        <ListGroup.Item>
          Assign labels to each field or table. Feel free to add any optional
          comments to specify special processing needs, such as data quality
          checks or transformations post extraction.
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}
function GeneralInstructions() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Model Preparation</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          For demo versions, model preparation is swift - generally completed in
          under 4 hours. Our customer support team will keep you in the loop and
          inform you the moment your model is ready.
        </ListGroup.Item>
        <ListGroup.Item>
          Once your model is trained, it's all set to efficiently process bulk
          quantities of similar documents. Efficient, effective, and tailored
          just for you!
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default IntroComponent;
