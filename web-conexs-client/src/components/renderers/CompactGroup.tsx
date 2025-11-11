import {
  MaterialLayoutRenderer,
  MaterialLayoutRendererProps,
} from "@jsonforms/material-renderers";
import { Stack, Typography } from "@mui/material";

import { withJsonFormsLayoutProps } from "@jsonforms/react";

import { rankWith, uiTypeIs } from "@jsonforms/core";

export const CompactGroupTester = rankWith(1000, uiTypeIs("Group"));

//@ts-expect-error: Until I figure out the typing for this....
const CompactGroupRenderer = (props) => {
  const { uischema, schema, path, visible, renderers } = props;

  const layoutProps: MaterialLayoutRendererProps = {
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

export const CompactGroup = withJsonFormsLayoutProps(CompactGroupRenderer);
