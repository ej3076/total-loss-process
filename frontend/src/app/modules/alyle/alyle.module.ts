import { NgModule } from '@angular/core';
import { MinimaDark, MinimaLight } from '@alyle/ui/themes/minima';
import { LyThemeModule, LY_THEME } from '@alyle/ui';
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyIconModule } from '@alyle/ui/icon';
import { LyCardModule } from '@alyle/ui/card';
import { LyGridModule } from '@alyle/ui/grid';
import { LyBadgeModule } from '@alyle/ui/badge';
import { LyFieldModule } from '@alyle/ui/field';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyCarouselModule } from '@alyle/ui/carousel';

export class CustomMinimaLight extends MinimaLight {
  primary = {
    default: '#0978BC',
    contrast: '#fff',
  };
  offPrimary = {
    default: '#0978BC',
    contrast: '#fff',
  };
  accent = {
    default: '#FFFFFF',
    contrast: '#000',
  };
  warn = {
    default: '#D92E14',
    contrast: '#fff',
  };
  secondary = {
    default: '#102B4E',
    contrast: '#fff',
  };
}

export class CustomMinimaDark extends MinimaDark {
  primary = {
    default: '#0978BC',
    contrast: '#fff',
  };
  offPrimary = {
    default: '#FFFFFF',
    contrast: '#0978BC',
  };
  accent = {
    default: '#FFFFFF',
    contrast: '#000',
  };
  warn = {
    default: '#D92E14',
    contrast: '#fff',
  };
  secondary = {
    default: '#DDDDDD',
    contrast: '#000',
  };
}

@NgModule({
  imports: [
    LyThemeModule.setTheme('minima-light'),
    LyButtonModule,
    LyToolbarModule,
    LyTabsModule,
    LyTypographyModule,
    LyResizingCroppingImageModule,
    LyTypographyModule,
    LyMenuModule,
    LyIconModule,
    LyCardModule,
    LyGridModule,
    LyBadgeModule,
    LyFieldModule,
    LyRadioModule,
    LyCheckboxModule,
    LyDrawerModule,
    LyCarouselModule,
  ],
  providers: [
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true },
  ],
  exports: [
    LyButtonModule,
    LyToolbarModule,
    LyTabsModule,
    LyTypographyModule,
    LyResizingCroppingImageModule,
    LyTypographyModule,
    LyMenuModule,
    LyIconModule,
    LyCardModule,
    LyGridModule,
    LyBadgeModule,
    LyFieldModule,
    LyRadioModule,
    LyCheckboxModule,
    LyDrawerModule,
    LyCarouselModule,
  ],
})
export class AlyleModule {}
