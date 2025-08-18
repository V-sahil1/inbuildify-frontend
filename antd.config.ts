const theme = {
    components: {
      Button: {
        colorPrimary: 'var(--primary)',
        colorText: 'var(--white)',
        colorBorder: 'var(--primary)',
        colorBgBase: 'var(--primary-10)',
      },
      Input: {
        colorBgContainer: 'var(--card-color)',
        colorText: 'var(--font-color)',
        colorBorder: 'var(--border-color)',
        colorPrimary: 'var(--primary)',
        colorError: 'var(--danger)',
        colorSuccess: 'var(--success)',
        colorWarning: 'var(--warning)',
        colorPlaceholder: 'var(--font-color-100)',
      },
      Checkbox: {
        colorPrimary: 'var(--primary)',
        colorBgContainer: 'var(--card-color)',
        colorBorder: 'var(--border-color)',
        colorText: 'var(--font-color)',
      },
      Form: {
        labelColor: 'var(--font-color-100)',
        labelFontSize: 14,
        labelHeight: 20,
        itemMarginBottom: 16,
      },
      // Add more components (Radio, Switch, etc.) as needed
    },
  };
  
  export default theme;