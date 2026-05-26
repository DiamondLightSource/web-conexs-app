{{/*
Expand the name of the chart.
*/}}
{{- define "web-conexs.name" -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
