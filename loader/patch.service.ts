import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {Mortgage} from '../models/Mortgage';
import {Logger, LogLevel} from './logger.service';
import {GuidService} from './guid.service';
import {Finalize} from '../models/Finalize';

@Injectable()
export class Patcher {

  constructor(private logger: Logger, private guidService: GuidService) {
  }

  patch(original, changed, config, propName) {
    let primaryKey = (config && config.primaryKey) ? config.primaryKey : 'id';

    if (_.isArray(changed)) {
      if (!original) original = [];
      if (!original.length && !changed.length) return undefined;

      // if it's an array containing primitives, deep compare and always serialize if different.
      if (_.some(original.concat(changed), (o) => !_.isObject(o))) {
        if (!_.isEqual(original, changed)) {
          this.logger.log(`Serializing entire array at ${propName} since it contained primitives.`, changed);
          return changed;
        } else {
          this.logger.log(`Array at ${propName} contained primitives but did not have changes to serialize.`, changed);
          return undefined;
        }
      }

      // primary key missing from objects, do not serialize
      if (_.some(original.concat(changed), (o) => !_.has(o, primaryKey))) {
        this.logger.log(`All objects in array at ${propName} did not contain primary key ${primaryKey}, skipping serialization.`, {original: original, changed: changed}, LogLevel.WARN);
        return undefined;
      }

      // remove client-side guids
      _.forEach(changed, (changedRecord) => {
        let key = changedRecord[primaryKey];
        if (!key) return;
        if (key.indexOf(this.guidService.clientGuidPrefix) === 0) changedRecord[primaryKey] = null;
      });


      // changed records have truthy primary key and matching record in original array
      let changedRecords = _.filter(changed, (changedRecord) => {
        return !!changedRecord[primaryKey] && _.some(original, (originalRecord) => {
              return changedRecord[primaryKey] === originalRecord[primaryKey];
            });
      });

      // new records have falsey primary key
      let newRecords = _.filter(changed, (changedRecord) => {
        return !changedRecord[primaryKey];
      });

      // deleted records are original records with truthy primary key but no matching record in changed array
      let deletedRecords = _.filter(original, (originalRecord) => {
        return !!originalRecord[primaryKey] && !_.some(changed, (changedRecord) => {
              return changedRecord[primaryKey] === originalRecord[primaryKey];
            });
      });

      let patch = [];

      _.forEach(changedRecords, (changedRecord) => {
        let matchingOriginalRecord = _.find(original, (originalRecord) => {
          return originalRecord[primaryKey] == changedRecord[primaryKey];
        });
        if (!matchingOriginalRecord) return; // should never hit
        let patchedRecord = this.patch(matchingOriginalRecord, changedRecord, config, propName);
        if (patchedRecord == undefined) return;
        patchedRecord.entityState = 'Modified';
        patch.push(patchedRecord);
      });

      _.forEach(deletedRecords, (deletedRecord) => {
        let patchRecord = {
          entityState: 'Deleted' // ['Current', 'New', 'Modified', 'Deleted']
        };
        patchRecord[primaryKey] = deletedRecord[primaryKey];
        patch.push(patchRecord);
      });

      _.forEach(newRecords, (newRecord: any) => {
        newRecord.entityState = 'New'; // ['Current', 'New', 'Modified', 'Deleted']
        // newRecord[primaryKey] = newRecord[primaryKey]; // should be null
        //FIX: Sergey 12/7/2016 - all of the nested values that are objects need to have entity state set to 'New', otherwise they get ignored by the back-end
        this.patch(null, newRecord, config, propName); 
        patch.push(newRecord);
      });

      if (!patch.length) return undefined;

      return patch;
    } else if (_.isObject(changed)) {

      let patch: any = {};
      for (let key in changed) {
        let originalProp = original ? original[key] : null;
        let changedProp = changed[key];
        let propConfig = (config && config.properties) ? config.properties[key] : null;
        let newProp = this.patch(originalProp, changedProp, propConfig, `${propName}.${key}`);
        // console.log(`${propName}.${key}`, newProp);
        if (newProp !== undefined) patch[key] = newProp;
      }

      if (_.keys(patch).length === 0) return undefined;

      if (!original) {
        // changed[primaryKey] = null;
        let changedPrimaryKey = changed[primaryKey];
        if(changedPrimaryKey){
          if (changedPrimaryKey.indexOf(this.guidService.clientGuidPrefix) === 0){
            // changed[primaryKey] = null;
            changedPrimaryKey = null;
          }
        }

        if (changedPrimaryKey) patch[primaryKey] = changedPrimaryKey;

        changed.entityState = 'New';

        // return changed;
      } else {
        let originalPrimaryKey = original[primaryKey];
        let changedPrimaryKey = changed[primaryKey];
        if (changedPrimaryKey && originalPrimaryKey !== changedPrimaryKey) this.logger.log(`Primary key on ${propName} changed from ${originalPrimaryKey} to ${changedPrimaryKey}!`, null, LogLevel.WARN);
        if (changedPrimaryKey) patch[primaryKey] = changedPrimaryKey;
        patch.entityState = 'Modified';
      }

      return patch;
    } else {
      let diff = original === changed ? undefined : changed;
      return diff;
    }
  }

  patchMortgage(originalMortgage: Mortgage, changedMortgage: Mortgage): Mortgage {
    return this.patch(originalMortgage, changedMortgage, {}, 'root');
  }

  patchFinalize(originalFinalize: Finalize, changedFinalize: Finalize): Finalize {
    return this.patch(originalFinalize, changedFinalize, {}, 'root');
  }
}
