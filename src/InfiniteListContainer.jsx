import { useState, useEffect } from 'react';
import {
  UICompBuilder,
  NameConfig,
  stringSimpleControl,
  NumberControl,
  ArrayControl,
  Section,
  withDefault,
  withExposingConfigs,
  eventHandlerControl,
  styleControl,
  jsonObjectExposingStateControl,
  arrayStringExposingStateControl,
  arrayObjectExposingStateControl,
  booleanExposingStateControl,
  ContainerCompBuilder,
  BoolCodeControl,
  Container,
  withMethodExposing,
  AutoHeightControl,
  DisabledContext,
  HintPlaceHolder,
  InnerGrid,
  gridItemCompToGridItems,
} from "lowcoder-sdk";


/**
 * InfiniteListContainerComp
 */

const InfiniteListContainer = (function () {
  return new ContainerCompBuilder(
    {
      autoHeight: AutoHeightControl,
    },
    (props, dispatch) => {
      const { items, ...otherContainerProps } = props.container;
      return (
        <div style={{ backgroundColor: 'red', height: '50px', width: '50px' }}>
          <InnerGrid
            {...otherContainerProps}
            items={gridItemCompToGridItems(items)}
            autoHeight={props.autoHeight}
            minHeight={"30px"}
            containerPadding={[0, 0]}
            hintPlaceholder={HintPlaceHolder}
          />

        </div>
      );
    }
  ).setPropertyViewFn((children) => (
    <>
      <Section name={sectionNames.basic}>
        {children.title.propertyView({ label: trans("modalComp.title") })}
        {children.title.getView() && children.titleAlign.propertyView({ label: trans("modalComp.titleAlign"), radioButton: true })}
        {children.autoHeight.getPropertyView()}
        {!children.autoHeight.getView() &&
          children.height.propertyView({
            label: trans("modalComp.modalHeight"),
            tooltip: trans("modalComp.modalHeightTooltip"),
            placeholder: DEFAULT_HEIGHT + "",
          })}
        {children.width.propertyView({
          label: trans("modalComp.modalWidth"),
          tooltip: trans("modalComp.modalWidthTooltip"),
          placeholder: DEFAULT_WIDTH,
        })}
        {children.maskClosable.propertyView({
          label: trans("prop.maskClosable"),
        })}
        {children.showMask.propertyView({
          label: trans("prop.showMask"),
        })}
      </Section>
      <Section name={sectionNames.interaction}>{children.onEvent.getPropertyView()}</Section>
      <Section name={sectionNames.style}>{children.style.getPropertyView()}</Section>
    </>
  ))
    .build();
});

export default InfiniteListContainer;