import { MaterialLayoutRenderer } from "@jsonforms/material-renderers";
import { Stack, Typography } from "@mui/material";

import { withJsonFormsLayoutProps } from "@jsonforms/react";

import { rankWith, uiTypeIs } from "@jsonforms/core";

export const CompactGroupTester = rankWith(1000, uiTypeIs("Group"));

const CompactGroupRenderer = (props) => {
  const { uischema, schema, path, visible, renderers } = props;

  const layoutProps = {
    elements: uischema.elements,
    schema: schema,
    path: path,
    direction: "column",
    visible: visible,
    uischema: uischema,
    renderers: renderers,
  };
  return (
    <Stack spacing="10px">
      <Typography>{uischema.label}</Typography>

      <MaterialLayoutRenderer {...layoutProps} />
    </Stack>
  );
};

export default withJsonFormsLayoutProps(CompactGroupRenderer);
