import { Button, Card, CardActionArea, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Moment from 'react-moment'; // Import the Moment component
import './project.scss';
import { Plus } from "react-feather";

// import { makeStyles } from "@material-ui/core/styles";

const data = [{ "id": "5bd22506-3b30-4268-9c26-16fcae8d9704", "title": "Project 1", "createdDate": "2024-01-28T14:35:29.388Z", "documents": [{ "id": "d573e8b6-c596-4ed6-b89a-d312572c1852", "displayName": "Document 95vm8", "dateUploaded": "2024-01-28T14:35:29.388Z", "numberOfPages": 21, "associatedProjectId": "5bd22506-3b30-4268-9c26-16fcae8d9704" }, { "id": "a91274e4-6b61-4a66-9d99-d43b352e3878", "displayName": "Document aow5hm", "dateUploaded": "2024-01-28T14:35:29.388Z", "numberOfPages": 10, "associatedProjectId": "5bd22506-3b30-4268-9c26-16fcae8d9704" }, { "id": "38416586-76a7-451c-a05a-91390c820e22", "displayName": "Document ekrs4l", "dateUploaded": "2024-01-28T14:35:29.388Z", "numberOfPages": 19, "associatedProjectId": "5bd22506-3b30-4268-9c26-16fcae8d9704" }] }, { "id": "c3f82655-fcb4-44b3-98ab-a1f896c6ec20", "title": "Project 2", "createdDate": "2024-01-28T14:35:29.388Z", "documents": [{ "id": "d13ecb8a-0d06-4103-bb93-ed1625d74de3", "displayName": "Document d9hw9d", "dateUploaded": "2024-01-28T14:35:29.388Z", "numberOfPages": 25, "associatedProjectId": "c3f82655-fcb4-44b3-98ab-a1f896c6ec20" }, { "id": "9b7c0606-395c-4fd4-9c33-1934413627ad", "displayName": "Document tsvcpl", "dateUploaded": "2024-01-28T14:35:29.388Z", "numberOfPages": 11, "associatedProjectId": "c3f82655-fcb4-44b3-98ab-a1f896c6ec20" }, { "id": "b09edecd-1018-4564-838e-fe5d6445b3bb", "displayName": "Document 2b7bml", "dateUploaded": "2024-01-28T14:35:29.388Z", "numberOfPages": 10, "associatedProjectId": "c3f82655-fcb4-44b3-98ab-a1f896c6ec20" }, { "id": "d9cd4059-1997-4057-9d32-bbd988dfb2d0", "displayName": "Document gjxq3c", "dateUploaded": "2024-01-28T14:35:29.388Z", "numberOfPages": 2, "associatedProjectId": "c3f82655-fcb4-44b3-98ab-a1f896c6ec20" }, { "id": "d089ad70-19da-49c3-ae67-12750b392fb4", "displayName": "Document 9wgwcd", "dateUploaded": "2024-01-28T14:35:29.388Z", "numberOfPages": 5, "associatedProjectId": "c3f82655-fcb4-44b3-98ab-a1f896c6ec20" }] }, { "id": "bccd8f1e-6002-4707-a413-99e40683e007", "title": "Project 3", "createdDate": "2024-01-28T14:35:29.388Z", "documents": [{ "id": "1dd54720-bc7e-4c80-873f-7da4cb2ebc7e", "displayName": "Document w8rlic", "dateUploaded": "2024-01-28T14:35:29.388Z", "numberOfPages": 14, "associatedProjectId": "bccd8f1e-6002-4707-a413-99e40683e007" }, { "id": "d6c52183-04ad-4765-ab17-c10265ced4c4", "displayName": "Document t2ikdi", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 11, "associatedProjectId": "bccd8f1e-6002-4707-a413-99e40683e007" }, { "id": "4851fdb0-d3e6-4e2f-a1d1-507cac8ea522", "displayName": "Document kvmbiv", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 7, "associatedProjectId": "bccd8f1e-6002-4707-a413-99e40683e007" }] }, { "id": "1955e511-61fd-4ca3-85c1-e29eb455c27c", "title": "Project 4", "createdDate": "2024-01-28T14:35:29.389Z", "documents": [{ "id": "8f0c5096-68fe-4625-873e-bbd672463274", "displayName": "Document ckli2a", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 24, "associatedProjectId": "1955e511-61fd-4ca3-85c1-e29eb455c27c" }, { "id": "b627f6db-9018-4922-861a-a6078a1774b5", "displayName": "Document zd3rr", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 14, "associatedProjectId": "1955e511-61fd-4ca3-85c1-e29eb455c27c" }, { "id": "bfd087e3-ef39-4a45-84b5-c9de92ee5c64", "displayName": "Document 1lfolo", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 18, "associatedProjectId": "1955e511-61fd-4ca3-85c1-e29eb455c27c" }, { "id": "f1e06ce6-404e-4e5a-9eaa-9f7614e7acb3", "displayName": "Document 76cc8b", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 11, "associatedProjectId": "1955e511-61fd-4ca3-85c1-e29eb455c27c" }, { "id": "d53a1222-aada-4040-95a4-5c5b55cccfee", "displayName": "Document dqnb", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 14, "associatedProjectId": "1955e511-61fd-4ca3-85c1-e29eb455c27c" }] }, { "id": "884624c6-d2e1-482b-ae47-a2d290df94f8", "title": "Project 5", "createdDate": "2024-01-28T14:35:29.389Z", "documents": [{ "id": "4ecf3f22-196a-4d30-bb40-6c7da9ba1af3", "displayName": "Document 9to639", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 11, "associatedProjectId": "884624c6-d2e1-482b-ae47-a2d290df94f8" }, { "id": "b5bbea95-cc68-45d3-bd99-c10ae0c4dfe4", "displayName": "Document 0os9mz", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 15, "associatedProjectId": "884624c6-d2e1-482b-ae47-a2d290df94f8" }, { "id": "249bb70d-0572-41d9-87b1-d8576db2f6bd", "displayName": "Document 2mnvni", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 16, "associatedProjectId": "884624c6-d2e1-482b-ae47-a2d290df94f8" }, { "id": "bb66338c-cc92-4187-b6b2-2ae5dcc1a22f", "displayName": "Document 35rpz", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 19, "associatedProjectId": "884624c6-d2e1-482b-ae47-a2d290df94f8" }, { "id": "ba1e08d9-d464-4d1f-ab3b-1f91e825026a", "displayName": "Document 0d203b", "dateUploaded": "2024-01-28T14:35:29.389Z", "numberOfPages": 2, "associatedProjectId": "884624c6-d2e1-482b-ae47-a2d290df94f8" }] }]

// const useStyles = makeStyles((theme) => ({
//     
// }));

function ProjectComponent() {
    const navigate: any = useNavigate();
    return (
        <Grid className="gridContainer" container spacing={4}  justify="center">
            {
                data.map((project) => {
                    return (
                        <Grid key={project.id} item >
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea onClick={() => navigate(`/${project.id}/workspace`)}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {project.title}
                                </Typography>
                                <Typography variant="body" color="text.secondary">
                                    Imported Documents - {project.documents.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Created - <Moment format="DD/MM/YYYY">{project.createdDate}</Moment>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button color="primary" onClick={() => navigate(`/${project.id}/upload`)}>
                                <Plus></Plus> Import Documents
                            </Button>
                        </CardActions>
                    </Card>
                    </Grid>);
                })
            }
        </Grid>

    );
}

export default ProjectComponent;