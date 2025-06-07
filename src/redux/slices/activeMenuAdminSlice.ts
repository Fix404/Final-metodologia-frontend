// store/slices/activeAdminMenuSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MenuSection = 'USUARIOS' | 'PRODUCTOS' | 'PEDIDOS' | 'ESTADÍSTICAS' | 'FACTURACIÓN' | null;

export interface NavbarState {
  activeMenu: MenuSection;
  activeSubMenu: string | null;
  isDropdownOpen: boolean;
}

const initialState: NavbarState = {
  activeMenu: null,
  activeSubMenu: null,
  isDropdownOpen: false,
};

const activeAdminMenuSlice = createSlice({
  name: 'activeAdminMenuSlice',
  initialState,
  reducers: {
    setActiveMenu: (state, action: PayloadAction<MenuSection>) => {
      state.activeMenu = action.payload;
      state.isDropdownOpen = action.payload !== null;
    },
    setActiveSubMenu: (state, action: PayloadAction<string | null>) => {
      state.activeSubMenu = action.payload;
    },
    closeDropdown: (state) => {
      state.activeMenu = null;
      state.isDropdownOpen = false;
    },
    clearActiveSubMenu: (state) => {
      state.activeSubMenu = null;
    },
  },
});

export const { 
  setActiveMenu, 
  setActiveSubMenu, 
  closeDropdown, 
  clearActiveSubMenu 
} = activeAdminMenuSlice.actions;

export default activeAdminMenuSlice.reducer;