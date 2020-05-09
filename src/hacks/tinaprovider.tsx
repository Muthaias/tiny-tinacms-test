import * as React from "react";
import { ModalProvider } from "@tinacms/react-modals";
import { SidebarProvider, SidebarPosition } from "@tinacms/react-sidebar";
import { ToolbarProvider } from "@tinacms/react-toolbar";
import { Alerts } from "@tinacms/react-alerts";
import { TinaCMS, CMSContext } from "tinacms";
import { GlobalStyles } from "./globalstyles";

export interface TinaProviderProps {
  cms: TinaCMS
  hidden?: boolean
  position?: SidebarPosition
}

export const TinaProvider: React.FC<TinaProviderProps> = ({
  cms,
  children,
  hidden,
  position,
}) => {
  return (
    <CMSContext.Provider value={cms}>
      <ModalProvider>
        <GlobalStyles/>
        <Alerts alerts={cms.alerts} />
        <ToolbarProvider hidden={hidden} toolbar={cms.toolbar} />
        <SidebarProvider
          hidden={hidden}
          position={position}
          sidebar={cms.sidebar}
        >
          {children}
        </SidebarProvider>
      </ModalProvider>
    </CMSContext.Provider>
  )
}