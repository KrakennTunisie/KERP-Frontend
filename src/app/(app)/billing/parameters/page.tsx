import lazyComponent from "@/shared/utils/lazyComponent";

const ParametrePage = lazyComponent(
  () => import("./parametersPage"),
  "Chargement des paramètres..."
);

import React from 'react'

export default function page() {
  return (
    <ParametrePage/>
  )
}
