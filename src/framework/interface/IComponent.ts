import { ICommand } from './ICommand';
import { IAsyncInit } from './IAsyncInit';

export interface IComponent extends ICommand, IAsyncInit { }
