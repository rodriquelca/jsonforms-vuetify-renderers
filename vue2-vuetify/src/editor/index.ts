export { default as SuggestControlRendererEditor } from './SuggestControlRendererEditor.vue';
export { default as DropdownControlRendererEditor } from './DropdownControlRendererEditor.vue';
export { default as RadioGroupControlRendererEditor } from './RadioGroupControlRendererEditor.vue';
export { default as CheckboxGroupControlRendererEditor } from './CheckboxGroupControlRendererEditor.vue';
export { default as HtmlViewerControlRendererEditor } from './HtmlViewerControlRendererEditor.vue';
export { default as ImageControlRendererEditor } from './ImageControlRendererEditor.vue';
export { default as EditorStringControlRenderer } from './EditorStringControlRenderer.vue';

import { entry as suggestControlRendererEditorEntry } from './SuggestControlRendererEditor.vue';
import { entry as dropdownControlRendererEditorEntry } from './DropdownControlRendererEditor.vue';
import { entry as radioGroupControlRendererEditorEntry } from './RadioGroupControlRendererEditor.vue';
import { entry as checkboxGroupControlRendererEditorEntry } from './CheckboxGroupControlRendererEditor.vue';
import { entry as htmlViewerControlRendererEditorEntry } from './HtmlViewerControlRendererEditor.vue';
import { entry as imageControlRendererEditorEntry } from './ImageControlRendererEditor.vue';
import { entry as editorStringControlRendererEntry } from './EditorStringControlRenderer.vue';

export const editorRenderers = [
  suggestControlRendererEditorEntry,
  dropdownControlRendererEditorEntry,
  htmlViewerControlRendererEditorEntry,
  radioGroupControlRendererEditorEntry,
  checkboxGroupControlRendererEditorEntry,
  imageControlRendererEditorEntry,
  editorStringControlRendererEntry,
];
