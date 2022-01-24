const app = {
  state: {
    count: []
  },
  mutaions: {
    setShopcar: ( state, payload ) => {
        state.count = [...state.shopcarlist, payload]
    }
  }
};

export default app;
