import React, { VFC } from 'react';
import { Box, Flex, HStack, Button } from '@chakra-ui/core';
import TransformControlsModeRadio from './TransformControlsModeRadio';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import ReferenceWindow from './ReferenceWindow';
import { saveAs } from 'file-saver';
import TransformControlsSpaceRadio from './TransformControlsSpaceRadio';
import ViewportShadingRadio from './ViewportShadingRadio';
import SceneOutlinePanel from './SceneOutlinePanel';
import PropertiesPanel from './PropertiesPanel';

const UI: VFC = () => {
  const [
    transformControlsMode,
    transformControlsSpace,
    viewportShading,
    setTransformControlsMode,
    setTransformControlsSpace,
    setViewportShading,
    setEditorOpen,
  ] = useEditorStore(
    (state) => [
      state.transformControlsMode,
      state.transformControlsSpace,
      state.viewportShading,
      state.setTransformControlsMode,
      state.setTransformControlsSpace,
      state.setViewportShading,
      state.setEditorOpen,
    ],
    shallow
  );

  return (
    <Box
      pos="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      zIndex={1005}
      pointerEvents="none"
    >
      <Flex height="100%">
        <Box width="min-content" pointerEvents="all">
          <SceneOutlinePanel />
        </Box>
        <Box pos="relative" flex="1" m={5}>
          <Flex align="start" justify="space-between">
            <HStack spacing={4}>
              <Box pointerEvents="all">
                <TransformControlsModeRadio
                  value={transformControlsMode}
                  onChange={(value) => setTransformControlsMode(value)}
                />
              </Box>
              <Box pointerEvents="all">
                <TransformControlsSpaceRadio
                  value={transformControlsSpace}
                  onChange={setTransformControlsSpace}
                />
              </Box>
              <Box pointerEvents="all">
                <ViewportShadingRadio
                  value={viewportShading}
                  onChange={setViewportShading}
                />
              </Box>
            </HStack>
            <ReferenceWindow height={120} />
          </Flex>

          {/* Bottom-left corner*/}
          <Button
            pos="absolute"
            left={0}
            bottom={0}
            pointerEvents="all"
            onClick={() => setEditorOpen(false)}
          >
            Close
          </Button>

          {/* Bottom-right corner */}
          <Button
            pos="absolute"
            right={0}
            bottom={0}
            pointerEvents="all"
            onClick={() => {
              const blob = new Blob(
                [
                  JSON.stringify(
                    {
                      editables: Object.fromEntries(
                        Object.entries(useEditorStore.getState().editables).map(
                          ([name, editable]) => [
                            name,
                            {
                              transform: editable.transform.toArray(),
                            },
                          ]
                        )
                      ),
                    },
                    null,
                    2
                  ),
                ],
                { type: 'text/json;charset=utf-8' }
              );
              saveAs(blob, 'editableState.json');
            }}
          >
            Export
          </Button>
        </Box>
        <Box width="min-content" pointerEvents="all">
          <PropertiesPanel />
        </Box>
      </Flex>
    </Box>
  );
};

export default UI;
