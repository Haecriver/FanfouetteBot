import { Db } from "mongodb";
import BotParameters from '../models/BotParameters';
import ICRUD from './CRUD/ICRUD';

export default interface IDao {
    botParametersCRUD: ICRUD<BotParameters>
}