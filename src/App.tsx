import { useCallback, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { useSpecimenStyle } from './hooks/useSpecimenStyle';
import { useFontFace } from './hooks/useFontFace';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PrintPreview } from './components/PrintPreview';

export function App() {
  const {
    theme,
    setTheme,
    fontUrl,
    metadata,
    glyphs,
    axes,
    setAxisValue,
    activeFeatures,
    toggleFeature,
    activeTab,
    setActiveTab,
    isPrinting,
    setIsPrinting,
    isPrintPreview,
    setIsPrintPreview,
    pageSize,
    setPageSize,
    pageOrientation,
    setPageOrientation,
    currentPageIndex,
    setCurrentPageIndex,
    proofingBlocks,
    activeProofingBlockId,
    proofingSyncText,
    setActiveProofingBlockId,
    setProofingSyncText,
    addProofingBlock,
    updateProofingBlock,
    removeProofingBlock,
    duplicateProofingBlock,
    syncAllProofingBlocksText,
    annotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    axisAnimating,
    setAxisAnimatingState,
    loadFont,
    resetFont,
    acceptFont,
    loadError,
    loading,
    clearLoadError,
    activeTool,
    setActiveTool,
    zoom,
    zoomIn,
    zoomOut,
    zoomReset,
    currentTextStyle,
    setCurrentTextStyle,
    textFrames,
    addTextFrame,
    updateTextFrame,
    removeTextFrame,
    drawings,
    addDrawingStroke,
    selectedElementId,
    setSelectedElementId,
  } = useAppStore();

  const effectiveTheme = isPrinting ? 'light' : theme;
  useFontFace(fontUrl, metadata?.fileType);
  const specimenStyle = useSpecimenStyle(fontUrl, axes, activeFeatures);

  useEffect(() => {
    document.body.classList.toggle('light-theme', effectiveTheme === 'light');
    return () => document.body.classList.remove('light-theme');
  }, [effectiveTheme]);

  const handleExportPdf = useCallback(() => {
    setIsPrintPreview(true);
  }, [setIsPrintPreview]);

  useEffect(() => {
    if (!isPrinting) return;
    const t = setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
    return () => clearTimeout(t);
  }, [isPrinting, setIsPrinting]);

  if (isPrintPreview) {
    return (
      <PrintPreview
        onClose={() => setIsPrintPreview(false)}
        onPrint={() => window.print()}
        pageSize={pageSize}
        pageOrientation={pageOrientation}
        activeTab={activeTab}
        specimenStyle={specimenStyle}
        theme={theme}
        fontUrl={fontUrl}
        fontFileType={metadata?.fileType}
      />
    );
  }

  return (
    <div
      className={`flex min-h-screen font-ui ${
        isPrinting ? 'h-auto overflow-visible bg-white text-gray-900' : 'h-screen overflow-hidden'
      } ${
        !isPrinting && effectiveTheme === 'dark'
          ? 'bg-[#0a0a0b] text-white/90'
          : ''
      } ${
        !isPrinting && effectiveTheme === 'light'
          ? 'bg-[#f5f5f7] text-gray-900'
          : ''
      }`}
    >
      {!isPrinting && (
        <Sidebar
          theme={theme}
          setTheme={setTheme}
          fontUrl={fontUrl}
          metadata={metadata}
          axes={axes}
          setAxisValue={setAxisValue}
          activeFeatures={activeFeatures}
          toggleFeature={toggleFeature}
          loadFont={loadFont}
          resetFont={resetFont}
          acceptFont={acceptFont}
          loadError={loadError}
          loading={loading}
          clearLoadError={clearLoadError}
          specimenStyle={specimenStyle}
          onExportPdf={handleExportPdf}
          axisAnimating={axisAnimating}
          setAxisAnimatingState={setAxisAnimatingState}
        />
      )}
      <Canvas
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        specimenStyle={specimenStyle}
        fontUrl={fontUrl}
        axes={axes}
        activeFeatures={activeFeatures}
        isPrinting={isPrinting}
        theme={effectiveTheme}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageOrientation={pageOrientation}
        setPageOrientation={setPageOrientation}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={setCurrentPageIndex}
        glyphs={glyphs}
        proofingBlocks={proofingBlocks}
        activeProofingBlockId={activeProofingBlockId}
        proofingSyncText={proofingSyncText}
        setActiveProofingBlockId={setActiveProofingBlockId}
        setProofingSyncText={setProofingSyncText}
        addProofingBlock={addProofingBlock}
        updateProofingBlock={updateProofingBlock}
        removeProofingBlock={removeProofingBlock}
        duplicateProofingBlock={duplicateProofingBlock}
        syncAllProofingBlocksText={syncAllProofingBlocksText}
        annotations={annotations}
        addAnnotation={addAnnotation}
        updateAnnotation={updateAnnotation}
        removeAnnotation={removeAnnotation}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        zoom={zoom}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        zoomReset={zoomReset}
        currentTextStyle={currentTextStyle}
        setCurrentTextStyle={setCurrentTextStyle}
        textFrames={textFrames}
        addTextFrame={addTextFrame}
        updateTextFrame={updateTextFrame}
        removeTextFrame={removeTextFrame}
        drawings={drawings}
        addDrawingStroke={addDrawingStroke}
        selectedElementId={selectedElementId}
        setSelectedElementId={setSelectedElementId}
      />
    </div>
  );
}
