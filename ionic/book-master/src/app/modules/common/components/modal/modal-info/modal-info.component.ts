import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

export interface ModalInfoData {
  title: string;
  info: string;
}

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent {
  @Input() data!: ModalInfoData;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
