import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HotspotCreateDialogComponent} from './hotspot-create-dialog.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import { ScenesService } from 'src/app/services/scenes.service';
import {HttpClientModule} from "@angular/common/http";

describe('HotspotCreateDialogComponent', () => {
  let component: HotspotCreateDialogComponent;
  let fixture: ComponentFixture<HotspotCreateDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<HotspotCreateDialogComponent>>;
  let sceneService: jasmine.SpyObj<ScenesService>;

  beforeEach(async(() => {
    // tslint:disable-next-line:no-shadowed-variable
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    const sceneServiceMock = jasmine.createSpyObj('ScenesService', ['addHotspot', 'checkNames']);
    TestBed.configureTestingModule({
      declarations: [HotspotCreateDialogComponent],
      imports: [MatDialogModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), RouterTestingModule, HttpClientModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRef
        },
        { provide: ScenesService, useValue: sceneServiceMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotspotCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<HotspotCreateDialogComponent>>;
    sceneService = TestBed.inject(ScenesService) as jasmine.SpyObj<ScenesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.getTypeSound('abc');
    expect(component.typeSound).toEqual('abc');
  });

  // check if it is calls specific function with specific selected items
  it('submit:: should submit hotSpot with soundAudio', () => {
    component.typeSound = 'soundAudio';
    component.selectedScene = 1;
    component.selectedSound = 'data:audio/wav';
    sceneService.checkNames.and.returnValue(true);
    component.submit({value: { soundSelected: 'abc', name: 'xyz', color: '#0080ff', write: '', strokeWidth: '2' }});
    expect(sceneService.addHotspot).toHaveBeenCalledWith(component.selectedScene, component.selectedImage, 'xyz', component.svgPath, `#0080ff`, component.selectedSound, component.typeSound, Number(`2`));
    expect(dialogRef.close).toHaveBeenCalled();
  });

  // check if it is calls specific function with specific selected items
  it('submit:: should submit hotSpot with writeAudio', () => {
    component.typeSound = 'writeAudio';
    component.selectedScene = 1;
    component.selectedSound = 'data:audio/wav';
    sceneService.checkNames.and.returnValue(true);
    component.submit({value: { soundSelected: 'abc', name: 'xyz', color: '#0080ff', write: 'pqr', strokeWidth: '2' }});
    expect(sceneService.addHotspot).toHaveBeenCalledWith(component.selectedScene, component.selectedImage, 'xyz', component.svgPath, `#0080ff`, 'pqr', component.typeSound, Number(`2`));
    expect(dialogRef.close).toHaveBeenCalled();
  });

  // check if it is calls specific function with specific selected items
  it('submit:: should submit hotSpot with soundAudio', () => {
    component.typeSound = 'soundAudio';
    component.selectedScene = 1;
    component.selectedSound = 'data:audio/wav';
    sceneService.checkNames.and.returnValue(false);
    spyOn(component, 'audioIsValid').and.returnValue(false);
    component.submit({value: { soundSelected: 'abc', name: 'xyz', color: '#0080ff', write: '', strokeWidth: '2' }});
    expect(sceneService.addHotspot).not.toHaveBeenCalledWith(component.selectedScene, component.selectedImage, 'xyz', component.svgPath, `#0080ff`, component.selectedSound, component.typeSound, Number(`2`));
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  // check if it doesn't call specific function with specific selected items
  it('submit:: should submit hotSpot with soundAudio', () => {
    component.typeSound = 'soundAudio';
    component.selectedScene = 1;
    component.selectedSound = 'data:audio/wav';
    component.submit({value: { soundSelected: 'abc', name: 'xyz', color: '#0080ff', write: '', strokeWidth: 0 }});
    expect(sceneService.addHotspot).not.toHaveBeenCalledWith(component.selectedScene, component.selectedImage, 'xyz', component.svgPath, `#0080ff`, component.selectedSound, component.typeSound, Number(`2`));
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  // cover the scenario with typeSound soundAudio
  // arrange the object in submit such a way that it will show error
  it('submit:: should submit hotSpot with soundAudio', () => {
    component.typeSound = 'soundAudio';
    component.selectedScene = 1;
    component.selectedSound = 'data:audio/wav';
    component.submit({value: { soundSelected: 'abc', name: 'xyz', color: '#0080ff', write: '', strokeWidth: 2 }});
    sceneService.checkNames.and.returnValue(false);
    expect(sceneService.addHotspot).not.toHaveBeenCalledWith(component.selectedScene, component.selectedImage, 'xyz', component.svgPath, `#0080ff`, component.selectedSound, component.typeSound, Number(`2`));
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  // function should set file from the passed event
  it('onSoundSelected:: should set selected file from event', () => {
    const blob = new Blob([''], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    const file = blob as File;
    const fileList: FileList = {
      0: file,
      1: file,
      length: 2,
      item: (index: number) => file
    };
    component.onSoundSelected({target: {files: fileList}});
  });

  // spy upon the FileReader and return the object which is used in the function
  // at last just check if FileReader instance is getting created or not
  it('onSoundSelected:: should show error if file reader fails', () => {
    const blob = new Blob([''], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    const file = blob as File;
    const fileList: FileList = {
      0: file,
      1: file,
      length: 2,
      item: (index: number) => file
    };
    spyOn(window, 'FileReader').and.returnValue({
      onload() {},
      readAsDataURL() {
        return true;
      },
      onerror: () => {}
    } as any);
    component.onSoundSelected({target: {files: fileList}});
    // @ts-ignore
    window.FileReader().onerror('error');
    expect(window.FileReader).toHaveBeenCalled();
  });

  // function should set file from the passed event
  it('stop:: should set selected file from event', () => {
    const blob = new Blob([''], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    blob['result'] = '123';
    const file = blob as File;
    spyOn(component.audioRecorderService, 'getRecord').and.returnValue(file);
    component.stop();
    expect(component.selectedSound).toEqual(null);
  });

  // spy upon the FileReader and returns the object which is used in the function
  // at last just check if fileReader instance is getting created or not
  it('stop:: should show error if file reader fails', () => {
    const blob = new Blob([''], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    blob['result'] = '123';
    const file = blob as File;
    spyOn(component.audioRecorderService, 'getRecord').and.returnValue(file);
    spyOn(window, 'FileReader').and.returnValue({
      onload() {},
      readAsDataURL() {
        return true;
      },
      onerror: () => {}
    } as any);
    component.stop();
    // @ts-ignore
    window.FileReader().onerror('error');
    expect(window.FileReader).toHaveBeenCalled();
  });

  // cover the scenario with typeSound writeAudio
  // arrange the object in submit such a way that it will throw error.text
  it('submit:: should submit hotSpot with writeAudio', () => {
    component.typeSound = 'writeAudio';
    component.selectedScene = 1;
    component.selectedSound = 'data:audio/wav';
    sceneService.checkNames.and.returnValue(false);
    spyOn(component.translate, 'instant');
    spyOn(component, 'audioIsValid').and.returnValue(false);
    component.submit({value: { soundSelected: 'abc', name: 'xyz', color: '#0080ff', write: '', strokeWidth: '2' }});
    expect(sceneService.addHotspot).not.toHaveBeenCalledWith(component.selectedScene, component.selectedImage, 'xyz', component.svgPath, `#0080ff`, component.selectedSound, component.typeSound, Number(`2`));
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.translate.instant).toHaveBeenCalledWith('error.text');
  });

  // check if it doesn't call specific function with specific selected items
  it('submit:: should submit hotSpot with writeAudio', () => {
    component.typeSound = 'writeAudio';
    component.selectedScene = 1;
    component.selectedSound = 'data:audio/wav';
    spyOn(component.translate, 'instant');
    component.submit({value: { soundSelected: 'abc', name: 'xyz', color: '#0080ff', write: 'test', strokeWidth: 0 }});
    expect(sceneService.addHotspot).not.toHaveBeenCalledWith(component.selectedScene, component.selectedImage, 'xyz', component.svgPath, `#0080ff`, component.selectedSound, component.typeSound, Number(`2`));
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.translate.instant).toHaveBeenCalledWith('error.stroke');
  });

  // cover the scenario with typeSound writeAudio
  // arrange the object in submit such a way that it will throw error.name
  it('submit:: should submit hotSpot with writeAudio', () => {
    component.typeSound = 'writeAudio';
    component.selectedScene = 1;
    component.selectedSound = 'data:audio/wav';
    spyOn(component.translate, 'instant');
    component.submit({value: { soundSelected: 'abc', name: 'xyz', color: '#0080ff', write: 'test', strokeWidth: 2 }});
    sceneService.checkNames.and.returnValue(false);
    expect(sceneService.addHotspot).not.toHaveBeenCalledWith(component.selectedScene, component.selectedImage, 'xyz', component.svgPath, `#0080ff`, component.selectedSound, component.typeSound, Number(`2`));
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.translate.instant).toHaveBeenCalledWith('error.name');
  });

  // cover the scenario with typeSound as others
  // check if it doesn't call any internal methods of submit
  it('submit:: should not do anything if invalid typeSound is selected', () => {
    component.typeSound = 'lol!';
    spyOn(component.translate, 'instant');
    component.submit({value: { soundSelected: 'abc', name: 'xyz', color: '#0080ff', write: 'test', strokeWidth: 2 }});
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.translate.instant).not.toHaveBeenCalled();
  });
});
